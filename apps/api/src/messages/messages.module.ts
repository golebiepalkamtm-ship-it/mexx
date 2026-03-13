import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesResolver } from "./messages.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
