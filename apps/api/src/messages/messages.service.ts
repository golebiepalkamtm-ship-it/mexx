import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SendMessageInput } from "./dto/send-message.input";
import { Message } from "./models/message.model";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(
    senderId: string,
    input: SendMessageInput,
  ): Promise<Message> {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId: input.receiverId,
        messageText: input.content, // Map content to messageText from schema
        readStatus: false,
      },
      include: {
        sender: true,
        receiver: true,
      },
    }) as unknown as Message;
  }

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // Map Prisma result to GraphQL model (messageText -> content)
    return messages.map((msg) => ({
      ...msg,
      content: msg.messageText || "",
    })) as unknown as Message[];
  }

  async getConversations(userId: string): Promise<any[]> {
    // This is a simplified approach to get recent distinct conversations
    // A proper SQL implementation would be more complex with DISTINCT ON or GROUP BY
    // For MVP, we fetch recent messages involved with user and group by other party in code

    const recentMessages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit for MVP performance
      include: {
        sender: true,
        receiver: true,
      },
    });

    const conversationMap = new Map<string, any>();

    for (const msg of recentMessages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationMap.has(otherUser.id)) {
        conversationMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg.messageText,
          lastMessageAt: msg.createdAt,
        });
      }
    }

    return Array.from(conversationMap.values());
  }
}
