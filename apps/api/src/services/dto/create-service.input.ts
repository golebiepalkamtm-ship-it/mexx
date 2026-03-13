import { InputType, Field, Float, Int } from "@nestjs/graphql";

@InputType()
export class CreateServiceInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  price: number;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  category?: string;
}
