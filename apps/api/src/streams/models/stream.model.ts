import { Field, ObjectType, Int } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";

@ObjectType()
export class Stream {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String)
  status: string; // LIVE, OFFLINE

  @Field(() => Int)
  viewerCount: number;

  @Field(() => User)
  streamer: User;

  @Field(() => Date)
  startedAt: Date;
}
