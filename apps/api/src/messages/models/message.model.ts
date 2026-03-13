import { Field, ObjectType, ID } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => String)
  senderId: string;

  @Field(() => String)
  receiverId: string;

  @Field(() => User)
  sender: User;

  @Field(() => User)
  receiver: User;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Boolean)
  readStatus: boolean;
}
