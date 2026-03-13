import { Field, ObjectType, HideField } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @HideField()
  passwordHash?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  profilePhoto?: string;

  @Field(() => Boolean)
  verified: boolean;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  lastLogin?: Date;
}
