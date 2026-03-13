import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceInput } from "./dto/create-service.input";
import { Service } from "./models/service.model";

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createServiceInput: CreateServiceInput,
  ): Promise<Service> {
    const { price, ...rest } = createServiceInput;
    return this.prisma.service.create({
      data: {
        userId,
        ...rest,
        price: price, // Prisma handles number to Decimal usually
      },
      include: {
        user: true,
      },
    }) as unknown as Service; // Casting because of Decimal type mismatch in strict TS vs GraphQL Float
  }

  async findAll(): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return services as unknown as Service[];
  }

  async findOne(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    return service as unknown as Service;
  }
}
