import { Module } from "@nestjs/common";
import { StreamsService } from "./streams.service";
import { StreamsResolver } from "./streams.resolver";
import { PrismaModule } from "../prisma/prisma.module";
import { WalletModule } from "../wallet/wallet.module";

@Module({
  imports: [PrismaModule, WalletModule],
  providers: [StreamsResolver, StreamsService],
})
export class StreamsModule {}
