import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { Message } from "./models/message.model";
import { SendMessageInput } from "./dto/send-message.input";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/models/user.model";

@ObjectType()
class Conversation {
  @Field(() => User)
  user: User;

  @Field(() => String, { nullable: true })
  lastMessage?: string;

  @Field(() => Date)
  lastMessageAt: Date;
}

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async sendMessage(
    @CurrentUser() user: any,
    @Args("sendMessageInput") input: SendMessageInput,
  ) {
    return this.messagesService.sendMessage(user.id, input);
  }

  @Query(() => [Message], { name: "messages" })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @CurrentUser() user: any,
    @Args("otherUserId") otherUserId: string,
  ) {
    return this.messagesService.getMessages(user.id, otherUserId);
  }

  @Query(() => [Conversation], { name: "conversations" })
  @UseGuards(GqlAuthGuard)
  async getConversations(@CurrentUser() user: any) {
    return this.messagesService.getConversations(user.id);
  }
}
