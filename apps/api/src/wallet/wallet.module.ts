import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletResolver } from "./wallet.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [WalletResolver, WalletService],
  exports: [WalletService],
})
export class WalletModule {}
