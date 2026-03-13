import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateStreamInput } from "./dto/create-stream.input";
import { Stream } from "./models/stream.model";
import { WalletService } from "../wallet/wallet.service";

@Injectable()
export class StreamsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async create(userId: string, input: CreateStreamInput): Promise<Stream> {
    return this.prisma.stream.create({
      data: {
        streamerId: userId,
        title: input.title,
        category: input.category,
        status: "LIVE",
        viewerCount: 0,
      },
      include: {
        streamer: true,
      },
    }) as unknown as Stream;
  }

  async findAll(): Promise<Stream[]> {
    return this.prisma.stream.findMany({
      where: { status: "LIVE" },
      include: {
        streamer: true,
      },
      orderBy: { startedAt: "desc" },
    }) as unknown as Stream[];
  }

  async findOne(id: string): Promise<Stream | null> {
    return this.prisma.stream.findUnique({
      where: { id },
      include: {
        streamer: true,
      },
    }) as unknown as Stream;
  }

  async endStream(userId: string, streamId: string): Promise<Stream> {
    const stream = await this.prisma.stream.findFirst({
      where: { id: streamId, streamerId: userId },
    });

    if (!stream) throw new Error("Stream not found or unauthorized");

    return this.prisma.stream.update({
      where: { id: streamId },
      data: {
        status: "OFFLINE",
        endedAt: new Date(),
      },
      include: { streamer: true },
    }) as unknown as Stream;
  }

  async sendTip(
    senderId: string,
    streamId: string,
    amount: number,
    message?: string,
  ): Promise<boolean> {
    // 1. Get stream to find streamer
    const stream = await this.prisma.stream.findUnique({
      where: { id: streamId },
    });
    if (!stream) throw new Error("Stream not found");

    // 2. Transfer tokens using WalletService
    await this.walletService.transferTokens(
      senderId,
      stream.streamerId,
      amount,
      "TIP",
    );

    // 3. Record tip in StreamTip to show in chat
    await this.prisma.streamTip.create({
      data: {
        streamId,
        senderId,
        tokenAmount: amount,
        message,
      },
    });

    return true;
  }

  // Get recent tips for chat/overlay
  async getTips(streamId: string): Promise<any[]> {
    return this.prisma.streamTip.findMany({
      where: { streamId },
      include: { sender: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }
}
