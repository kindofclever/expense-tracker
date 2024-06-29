import { PrismaClient, User } from '@prisma/client';
import { IResolvers } from '@graphql-tools/utils';
import bcrypt from 'bcryptjs';

import { LoginInput, SignUpInput } from '../interfaces/interfaces.ts';

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
    },
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Error in authUser: ", err);
        throw new Error("Internal server error");
      }
    },
  },

  Mutation: {
    signUp: async (_, { input }: { input: SignUpInput }, context) => {
      const { username, name, password, gender } = input;

      if (!username || !name || !password || !gender) {
        throw new Error("All fields are required");
      }

      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const profilePicture = `https://unavatar.io/github/37t?fallback=https://source.boringavatars.com/marble/120/1337_user?colors=264653r,2a9d8f,e9c46a,f4a261,e76f51`;

      const newUser = await prisma.user.create({
        data: {
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture,
        },
      });

      await context.login(newUser);
      return newUser;
    },

    login: async (_: any, { input }: { input: LoginInput }, context: any): Promise<User> => {
      const { username, password } = input;

      if (!username || !password) throw new Error("All fields are required");

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new Error("User does not exist");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      return new Promise((resolve, reject) => {
        console.log("context", context);
        context.req.login(user, (err: Error) => {
          if (err) return reject(err);
          resolve(user);
        });
      });
    },

    logout: async (_: any, __: any, context: any): Promise<{ message: string }> => {
      console.log("Logout mutation called");
      return new Promise((resolve, reject) => {
        context.req.logout((err: Error) => {
          if (err) {
            console.log("Error during logout:", err);
            return reject(err);
          }
          context.req.session.destroy((err: Error) => {
            if (err) {
              console.log("Error destroying session:", err);
              return reject(err);
            }
            context.res.clearCookie("connect.sid");
            console.log("User logged out successfully");
            resolve({ message: 'Logged out successfully' });
          });
        });
      });
    },
  },

  User: {
    transactions: async (parent) => {
      try {
        const transactions = await prisma.transaction.findMany({
          where: { userId: parent.id },
        });
        return transactions;
      } catch (err) {
        console.error("Error in user.transactions resolver: ", err);
        throw new Error("Internal server error");
      }
    },
  },
};

export default userResolver;
