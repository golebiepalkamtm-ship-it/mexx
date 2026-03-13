import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "./models/user.model";
import { CreateUserInput } from "./dto/create-user.input";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    return this.prisma.user.create({
      data: {
        email: createUserInput.email,
        passwordHash: hashedPassword,
        username: createUserInput.username,
        // Default values
        verified: false,
        status: "ACTIVE",
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneBySupabaseId(supabaseId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { supabaseId } });
  }

  async syncSupabaseUser(supabaseId: string, email: string, username?: string): Promise<User> {
    const existing = await this.findOneBySupabaseId(supabaseId);
    if (existing) return existing;

    // Check if user with same email exists but no supabaseId
    const existingByEmail = await this.findOneByEmail(email);
    if (existingByEmail) {
      return this.prisma.user.update({
        where: { email },
        data: { supabaseId },
      });
    }

    // Create new local user
    return this.prisma.user.create({
      data: {
        supabaseId,
        email,
        username: username || email.split("@")[0],
        verified: false,
        status: "ACTIVE",
      },
    });
  }
}
