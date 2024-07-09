import { PrismaClient } from '@prisma/client';
import { IResolvers } from '@graphql-tools/utils';

const prisma = new PrismaClient();

const tagResolver: IResolvers = {
  Query: {
    tags: async () => {
      return await prisma.tag.findMany();
    },
    userTags: async (_, { userId }: { userId: string }) => {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: { tags: { include: { tag: true } } },
      });
      return user?.tags.map(userTag => userTag.tag) || [];
    },
    customTags: async () => {
      return await prisma.customTag.findMany();
    },
  },

  Mutation: {
    createTag: async (_: any, { name }: { name: string }) => {
      return await prisma.tag.create({
        data: { name },
      });
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
      return await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: { tags: { include: { tag: true } } },
      });
    },

    createCustomTag: async (_: any, { name, searchTerm }: { name: string, searchTerm: string }) => {
      return await prisma.customTag.create({
        data: { name, searchTerm },
      });
    },
  },
};

export default tagResolver;
