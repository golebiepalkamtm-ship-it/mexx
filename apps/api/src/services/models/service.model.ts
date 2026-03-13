import { Field, ObjectType, Float, Int } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";

@ObjectType()
export class Service {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  price: number;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String)
  status: string;

  @Field(() => User)
  user: User;

  @Field(() => Date)
  createdAt: Date;
}
