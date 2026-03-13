import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
  Field,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { StreamsService } from "./streams.service";
import { Stream } from "./models/stream.model";
import { CreateStreamInput } from "./dto/create-stream.input";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/models/user.model";

@ObjectType()
class StreamTip {
  @Field(() => String)
  id: string;

  @Field(() => User)
  sender: User;

  @Field(() => Int)
  tokenAmount: number;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Date)
  createdAt: Date;
}

@Resolver(() => Stream)
export class StreamsResolver {
  constructor(private readonly streamsService: StreamsService) {}

  @Mutation(() => Stream)
  @UseGuards(GqlAuthGuard)
  async startStream(
    @CurrentUser() user: any,
    @Args("input") input: CreateStreamInput,
  ) {
    return this.streamsService.create(user.id, input);
  }

  @Mutation(() => Stream)
  @UseGuards(GqlAuthGuard)
  async endStream(
    @CurrentUser() user: any,
    @Args("streamId") streamId: string,
  ) {
    return this.streamsService.endStream(user.id, streamId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async sendStreamTip(
    @CurrentUser() user: any,
    @Args("streamId") streamId: string,
    @Args("amount", { type: () => Int }) amount: number,
    @Args("message", { nullable: true }) message?: string,
  ) {
    return this.streamsService.sendTip(user.id, streamId, amount, message);
  }

  @Query(() => [Stream], { name: "streams" })
  async getStreams() {
    return this.streamsService.findAll();
  }

  @Query(() => Stream, { name: "stream", nullable: true })
  async getStream(@Args("id") id: string) {
    return this.streamsService.findOne(id);
  }

  @Query(() => [StreamTip], { name: "streamTips" })
  async getStreamTips(@Args("streamId") streamId: string) {
    return this.streamsService.getTips(streamId);
  }
}
