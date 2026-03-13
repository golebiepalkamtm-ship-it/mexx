import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateStreamInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  category?: string;
}
