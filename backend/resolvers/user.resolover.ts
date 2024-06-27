import { PrismaClient } from '@prisma/client';
import { IResolvers } from '@graphql-tools/utils'

import { LoginInput, SignUpInput } from './../types/types.ts';

const prisma = new PrismaClient();


const userResolver: IResolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (_, { userId }: { userId: string }) => {
      return await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
    }
  },

  Mutation: {
    signUp: async (_, { input }: { input: SignUpInput }) => {
      const { username, name, password, gender } = input;
      return await prisma.user.create({
        data: {
          username,
          name,
          password,
          gender,
          profilePicture: '', // Set a default or handle as needed
        },
      });
    },
    login: async (_, { input }: { input: LoginInput }) => {
      const { username, password } = input;
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (user && user.password === password) {
        return user;
      }
      throw new Error('Invalid credentials');
    },
    logout: async () => {
      return {
        status: 'SUCCESS',
        message: 'Logged out successfully',
      };
    },
  },
};

export default userResolver;
