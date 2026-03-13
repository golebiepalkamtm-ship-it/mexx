import { Module } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ServicesResolver } from "./services.resolver";
import { PrismaModule } from "../prisma/prisma.module";
import { WalletModule } from "../wallet/wallet.module";

@Module({
  imports: [PrismaModule, WalletModule],
  providers: [ServicesResolver, ServicesService],
})
export class ServicesModule {}
