import { PrismaClient } from '@prisma/client';
import { IResolvers } from '@graphql-tools/utils';

const prisma = new PrismaClient();

const tagResolver: IResolvers = {
  Query: {
    tags: async () => {
      const tags = await prisma.tag.findMany();
      return tags;
    },
    userTags: async (_, { userId }: { userId: string }) => {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: { tags: { include: { tag: true } } },
      });
      const userTags = user?.tags.map(userTag => userTag.tag) || [];
      return userTags;
    },
    customTags: async () => {
      const customTags = await prisma.customTag.findMany();
      return customTags;
    },
  },

  Mutation: {
    createTag: async (_: any, { name }: { name: string }) => {
      const newTag = await prisma.tag.create({
        data: { name },
      });
      return newTag;
    },

    addUserTag: async (_: any, { userId, tagId }: { userId: string; tagId: string }) => {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          tags: {
            create: {
              tag: {
                connect: { id: parseInt(tagId) }
              }
            }
          }
        },
      });
      const updatedUser = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: { tags: { include: { tag: true } } },
      });
      return updatedUser;
    },

    createCustomTag: async (_: any, { name, searchTerm }: { name: string, searchTerm: string }) => {
      const newCustomTag = await prisma.customTag.create({
        data: { name, searchTerm },
      });
      return newCustomTag;
    },
  },
};

export default tagResolver;
