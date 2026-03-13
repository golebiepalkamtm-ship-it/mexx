import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Auth } from "./models/auth.model";
import { LoginInput } from "./dto/login.input";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async login(@Args("loginInput") loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
