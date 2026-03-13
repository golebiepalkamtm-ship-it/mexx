import { Field, ObjectType, Int } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";

@ObjectType()
export class Post {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => String, { nullable: true })
  mediaUrl?: string;

  @Field(() => Int)
  likesCount: number;

  @Field(() => Int)
  commentsCount: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => Boolean, { nullable: true })
  isLiked?: boolean;

  @Field(() => Boolean, { nullable: true })
  isLocked?: boolean;

  @Field(() => Int, { nullable: true })
  unlockPrice?: number;

  @Field(() => Boolean, { nullable: true })
  isUnlocked?: boolean;
}
