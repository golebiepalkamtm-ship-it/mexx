import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { LoginInput } from "./dto/login.input";
import { Auth } from "./models/auth.model";
import { User } from "../users/models/user.model";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string): Promise<User | null> {
    return this.usersService.findOneById(userId);
  }

  async login(loginInput: LoginInput): Promise<Auth> {
    const user = await this.usersService.findOneByEmail(loginInput.email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
