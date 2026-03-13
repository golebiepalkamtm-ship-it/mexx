import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { Service } from "./models/service.model";
import { CreateServiceInput } from "./dto/create-service.input";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/models/user.model";

@Resolver(() => Service)
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Mutation(() => Service)
  @UseGuards(GqlAuthGuard)
  async createService(
    @CurrentUser() user: any,
    @Args("createServiceInput") createServiceInput: CreateServiceInput,
  ) {
    return this.servicesService.create(user.id, createServiceInput);
  }

  @Query(() => [Service], { name: "services" })
  async getServices() {
    return this.servicesService.findAll();
  }

  @Query(() => Service, { name: "service", nullable: true })
  async getService(@Args("id", { type: () => String }) id: string) {
    return this.servicesService.findOne(id);
  }
}
