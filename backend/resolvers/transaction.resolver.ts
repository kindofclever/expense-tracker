import { PrismaClient, Transaction, User } from '@prisma/client';
import { IResolvers } from '@graphql-tools/utils';

import { CreateTransactionInput, UpdateTransactionInput } from '../interfaces/interfaces.js';

const prisma = new PrismaClient();

const transactionResolver: IResolvers = {
  Query: {
    transactions: async (_, __, context: any): Promise<Transaction[]> => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Unauthorized");
        const userId = user.id;

        const transactions = await prisma.transaction.findMany({
          where: { userId },
        });
        return transactions;
      } catch (err: unknown) {
        throw new Error("Error getting transactions");
      }
    },
    transaction: async (_, { transactionId }: { transactionId: string }): Promise<Transaction | null> => {
      try {
        const transaction = await prisma.transaction.findUnique({
          where: { id: parseInt(transactionId) },
        });
        return transaction;
      } catch (err: unknown) {
        throw new Error("Error getting transaction");
      }
    },
    categoryStatistics: async (_, __, context: any) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Unauthorized");

        const userId = user.id;
        const transactions = await prisma.transaction.findMany({
          where: { userId },
        });

        const categoryMap: { [key: string]: number } = {};

        transactions.forEach((transaction) => {
          if (!categoryMap[transaction.category]) {
            categoryMap[transaction.category] = 0;
          }
          categoryMap[transaction.category] += transaction.amount;
        });

        return Object.entries(categoryMap).map(([category, totalAmount]) => ({
          category,
          totalAmount,
        }));
      } catch (err: unknown) {
        throw new Error("Internal server error");
      }
    },

  },
  Mutation: {
    createTransaction: async (_, { input }: { input: CreateTransactionInput }, context: any): Promise<Transaction> => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Unauthorized");

        const { description, paymentType, category, amount, location, date } = input;
        if (!description || !paymentType || !category || amount === undefined || !location || !date) {
          throw new Error("All fields must be filled out");
        }

        if (amount <= 0) throw new Error("Amount must be a positive number");

        const newTransaction = await prisma.transaction.create({
          data: {
            ...input,
            user: {
              connect: { id: user.id },
            },
            location: input.location || "",
          },
        });
        return newTransaction;
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "Unauthorized" || err.message === "Amount must be a positive number" || err.message === "All fields must be filled out") {
            throw err;
          }
        }
        throw new Error("Error creating transaction");
      }
    },

    updateTransaction: async (_, { input }: { input: UpdateTransactionInput }): Promise<Transaction> => {
      try {
        const { description, paymentType, category, amount, location, date } = input;
        if (!description || !paymentType || !category || amount === undefined || !location || !date) {
          throw new Error("All fields must be filled out");
        }

        if (amount <= 0) throw new Error("Amount must be a positive number");

        const updatedTransaction = await prisma.transaction.update({
          where: { id: parseInt(input.transactionId) },
          data: {
            amount: input.amount,
            category: input.category,
            description: input.description,
            date: input.date,
            location: input.location,
            paymentType: input.paymentType
          },
        });
        return updatedTransaction;
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "Amount must be a positive number" || err.message === "All fields must be filled out") {
            throw err;
          }
        }
        throw new Error("Error updating transaction");
      }
    },

    deleteTransaction: async (_, { transactionId }: { transactionId: string }): Promise<Transaction> => {
      try {
        const deletedTransaction = await prisma.transaction.delete({
          where: { id: parseInt(transactionId) },
        });
        return deletedTransaction;
      } catch (err) {
        throw new Error("Error deleting transaction");
      }
    },
  },
  Transaction: {
    user: async (parent): Promise<User | null> => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: parent.userId },
        });
        return user;
      } catch (err) {
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;
