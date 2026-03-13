import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class SendMessageInput {
  @Field()
  receiverId: string;

  @Field()
  content: string;
}
