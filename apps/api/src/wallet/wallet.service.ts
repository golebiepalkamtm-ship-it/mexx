import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Wallet } from "./models/wallet.model";
import { TokenTransaction } from "./models/token-transaction.model";

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string): Promise<Wallet> {
    // Ensure wallet exists
    let wallet = await this.prisma.tokensWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await this.prisma.tokensWallet.create({
        data: { userId, balance: 0 },
      });
    }

    return wallet;
  }

  async getTransactions(userId: string): Promise<TokenTransaction[]> {
    return this.prisma.tokenTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }) as unknown as TokenTransaction[];
  }

  // Mock purchase of tokens (In real app, Stripe/PayPal webhook would trigger this)
  async depositTokens(userId: string, amount: number): Promise<Wallet> {
    // 1. Log transaction
    await this.prisma.tokenTransaction.create({
      data: {
        userId,
        type: "DEPOSIT",
        amount: amount,
      },
    });

    // 2. Update wallet
    const wallet = await this.prisma.tokensWallet.upsert({
      where: { userId },
      update: { balance: { increment: amount } },
      create: { userId, balance: amount },
    });

    return wallet;
  }

  async transferTokens(
    senderId: string,
    receiverId: string,
    amount: number,
    type = "TIP",
  ): Promise<boolean> {
    const senderWallet = await this.getWallet(senderId);

    if (senderWallet.balance < amount) {
      throw new Error("Insufficient funds");
    }

    // Transactional consistency
    await this.prisma.$transaction([
      // Deduct from sender
      this.prisma.tokensWallet.update({
        where: { userId: senderId },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.tokenTransaction.create({
        data: {
          userId: senderId,
          type: `${type}_SENT`,
          amount: -amount,
          referenceId: receiverId,
        },
      }),

      // Add to receiver
      this.prisma.tokensWallet.upsert({
        where: { userId: receiverId },
        update: { balance: { increment: amount } },
        create: { userId: receiverId, balance: amount },
      }),
      this.prisma.tokenTransaction.create({
        data: {
          userId: receiverId,
          type: `${type}_RECEIVED`,
          amount: amount,
          referenceId: senderId,
        },
      }),
    ]);

    return true;
  }

  async unlockContent(
    userId: string,
    postId: string,
  ): Promise<boolean> {
    // Get post and its price
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || !post.isLocked) throw new Error('Post nie jest zablokowany');

    const price = post.unlockPrice ?? 0;
    const wallet = await this.getWallet(userId);
    if (wallet.balance < price) throw new Error('Niewystarczające tokeny');

    // Check if already unlocked
    const existing = await this.prisma.contentUnlock.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existing) return true;

    // Deduct + create unlock record in transaction
    await this.prisma.$transaction([
      this.prisma.tokensWallet.update({
        where: { userId },
        data: { balance: { decrement: price } },
      }),
      this.prisma.tokenTransaction.create({
        data: { userId, type: 'UNLOCK', amount: -price, referenceId: postId },
      }),
      this.prisma.contentUnlock.create({
        data: { userId, postId },
      }),
      // reward creator
      this.prisma.tokensWallet.upsert({
        where: { userId: post.userId },
        update: { balance: { increment: price } },
        create: { userId: post.userId, balance: price },
      }),
      this.prisma.tokenTransaction.create({
        data: { userId: post.userId, type: 'UNLOCK_RECEIVED', amount: price, referenceId: userId },
      }),
    ]);

    return true;
  }
}
