import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Post } from "./models/post.model";
import { CreatePostInput } from "./dto/create-post.input";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/models/user.model";

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @CurrentUser() user: any,
    @Args("createPostInput") createPostInput: CreatePostInput,
  ) {
    return this.postsService.create(user.id, createPostInput);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async toggleLike(@Args("id") id: string, @CurrentUser() user: any) {
    return this.postsService.toggleLike(id, user.id);
  }

  @Query(() => [Post], { name: "feed" })
  async getFeed(
    @Args("searchTerm", { nullable: true }) searchTerm?: string,
    @CurrentUser() user?: any
  ) {
    return this.postsService.findAll(user?.id, searchTerm);
  }
}
