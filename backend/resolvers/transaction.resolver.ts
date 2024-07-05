import { PrismaClient, Transaction, User } from '@prisma/client';
import { IResolvers } from '@graphql-tools/utils';
import { Category, CreateTransactionInput, PaymentType, UpdateTransactionInput } from '../interfaces/interfaces.js';

const prisma = new PrismaClient();

const transactionResolver: IResolvers = {
  Query: {
    transactions: async (_, { offset, limit, filter }, context: any) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Unauthorized");
        const userId = user.id;


        // Helper function to check for partial matches
        const getPartialEnumMatches = (filter, enumObject) => {
          return Object.values(enumObject).filter(enumValue =>
            enumValue.toString().toLowerCase().includes(filter.toLowerCase())
          );
        };

        const paymentTypeMatches = getPartialEnumMatches(filter, PaymentType);
        const categoryMatches = getPartialEnumMatches(filter, Category);

        const filterConditions: any = filter
          ? {
            OR: [
              { description: { contains: filter } },
              { location: { contains: filter } },
              { date: { contains: filter } },
              ...(paymentTypeMatches.length > 0 ? [{ paymentType: { in: paymentTypeMatches } }] : []),
              ...(categoryMatches.length > 0 ? [{ category: { in: categoryMatches } }] : []),
              ...(isNaN(Number(filter)) ? [] : [{ amount: { equals: Number(filter) } }])
            ],
          }
          : {};

        const transactions = await prisma.transaction.findMany({
          where: { userId, ...filterConditions },
          skip: offset,
          take: limit,
          orderBy: { date: "desc" },
        });

        const totalTransactions = await prisma.transaction.count({
          where: { userId, ...filterConditions },
        });

        return {
          transactions,
          total: totalTransactions,
        };
      } catch (err) {
        console.error("Error fetching transactions:", err);
        throw new Error("Error getting transactions");
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
            description,
            paymentType,
            category,
            amount,
            date,
            location: location || "",
            user: {
              connect: { id: user.id },
            },
          },
        });
        return newTransaction;
      } catch (err) {
        console.error('Error creating transaction:', err);
        throw new Error("Error creating transaction");
      }
    },

    updateTransaction: async (_, { input }: { input: UpdateTransactionInput }): Promise<Transaction> => {
      try {
        const { transactionId, description, paymentType, category, amount, location, date } = input;
        if (!transactionId || (!description && !paymentType && !category && !amount && !location && !date)) {
          throw new Error("No fields to update");
        }

        const updatedTransaction = await prisma.transaction.update({
          where: { id: parseInt(transactionId) },
          data: {
            description,
            paymentType,
            category,
            amount,
            location,
            date,
          },
        });
        return updatedTransaction;
      } catch (err) {
        console.error('Error updating transaction:', err);
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
        console.error('Error deleting transaction:', err);
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
        console.error('Error fetching user:', err);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;
