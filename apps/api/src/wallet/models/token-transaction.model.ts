import { Field, ObjectType, Int, ID } from "@nestjs/graphql";

@ObjectType()
export class TokenTransaction {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  type: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String, { nullable: true })
  referenceId?: string;

  @Field(() => Date)
  createdAt: Date;
}
