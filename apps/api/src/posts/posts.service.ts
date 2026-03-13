import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostInput } from "./dto/create-post.input";
import { Post } from "./models/post.model";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createPostInput: CreatePostInput,
  ): Promise<Post> {
    return this.prisma.post.create({
      data: {
        userId,
        ...createPostInput,
      },
      include: {
        user: true,
      },
    });
  }

  async toggleLike(id: string, userId: string): Promise<Post> {
    const existingLike = await this.prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId,
        },
      },
    });

    let updatedPost;

    if (existingLike) {
      // Unlike
      await this.prisma.postLike.delete({
        where: {
          postId_userId: {
            postId: id,
            userId,
          },
        },
      });
      updatedPost = await this.prisma.post.update({
        where: { id },
        data: { likesCount: { decrement: 1 } },
        include: { user: true },
      });
      return { ...updatedPost, isLiked: false };
    } else {
      // Like
      await this.prisma.postLike.create({
        data: {
          postId: id,
          userId,
        },
      });
      updatedPost = await this.prisma.post.update({
        where: { id },
        data: { likesCount: { increment: 1 } },
        include: { user: true },
      });
      return { ...updatedPost, isLiked: true };
    }
  }

  async findAll(currentUserId?: string, searchTerm?: string): Promise<Post[]> {
    const where: any = {};
    if (searchTerm) {
      where.OR = [
        { content: { contains: searchTerm, mode: 'insensitive' } },
        { user: { username: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    const posts = await this.prisma.post.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!currentUserId) return posts.map(p => ({ ...p, isLiked: false, isUnlocked: false }));

    const [likes, unlocks] = await Promise.all([
      this.prisma.postLike.findMany({
        where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
      }),
      this.prisma.contentUnlock.findMany({
        where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
      }),
    ]);

    const likedPostIds = new Set(likes.map((l) => l.postId));
    const unlockedPostIds = new Set(unlocks.map((u) => u.postId));

    return posts.map((post) => ({
      ...post,
      isLiked: likedPostIds.has(post.id),
      isUnlocked: unlockedPostIds.has(post.id),
    }));
  }

  async findOne(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}
