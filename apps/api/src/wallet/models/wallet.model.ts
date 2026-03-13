import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class Wallet {
  @Field(() => String)
  userId: string;

  @Field(() => Int)
  balance: number;

  @Field(() => Date)
  updatedAt: Date;
}
