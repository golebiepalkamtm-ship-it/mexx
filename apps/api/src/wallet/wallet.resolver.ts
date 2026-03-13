import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { Wallet } from "./models/wallet.model";
import { TokenTransaction } from "./models/token-transaction.model";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/models/user.model";

@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Query(() => Wallet, { name: "myWallet" })
  @UseGuards(GqlAuthGuard)
  async getMyWallet(@CurrentUser() user: any) {
    return this.walletService.getWallet(user.id);
  }

  @Query(() => [TokenTransaction], { name: "myTransactions" })
  @UseGuards(GqlAuthGuard)
  async getMyTransactions(@CurrentUser() user: any) {
    return this.walletService.getTransactions(user.id);
  }

  @Mutation(() => Wallet)
  @UseGuards(GqlAuthGuard)
  async depositTokens(
    @CurrentUser() user: any,
    @Args("amount", { type: () => Int }) amount: number,
  ) {
    return this.walletService.depositTokens(user.id, amount);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async sendTokens(
    @CurrentUser() user: any,
    @Args("receiverId", { type: () => String }) receiverId: string,
    @Args("amount", { type: () => Int }) amount: number,
  ) {
    return this.walletService.transferTokens(user.id, receiverId, amount);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async unlockContent(
    @CurrentUser() user: any,
    @Args("postId", { type: () => String }) postId: string,
  ) {
    return this.walletService.unlockContent(user.id, postId);
  }
}
