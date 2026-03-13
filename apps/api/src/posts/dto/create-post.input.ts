import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class CreatePostInput {
  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  mediaUrl?: string;

  @Field(() => Boolean, { nullable: true })
  isLocked?: boolean;

  @Field(() => Int, { nullable: true })
  unlockPrice?: number;
}
