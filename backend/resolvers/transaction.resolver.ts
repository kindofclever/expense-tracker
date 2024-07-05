import { PrismaClient, Transaction, User } from '@prisma/client';
import { IResolvers } from '@graphql-tools/utils';
import { Category, CreateTransactionInput, PaymentType, UpdateTransactionInput } from '../interfaces/interfaces.js';

const prisma = new PrismaClient();

const transactionResolver: IResolvers = {
  Query: {
    transactions: async (_, { offset, limit, filter }, context) => {
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

        const convertDateFormat = (dateStr) => {
          const parts = dateStr.split('.');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            if (day.length === 2 && month.length === 2 && year.length === 4) {
              return `${year}-${month}-${day}`;
            }
          }
          return null;
        };

        const getPartialDateConditions = (dateStr) => {
          const conditions = [];
          if (dateStr.length >= 4) {
            const year = dateStr.substring(6, 10); // Extract year from dd.mm.yyyy
            conditions.push({ date: { contains: year } });
          }
          if (dateStr.length >= 7) {
            const month = dateStr.substring(3, 5); // Extract month from dd.mm.yyyy
            conditions.push({ date: { contains: `-${month}-` } });
          }
          if (dateStr.length === 10) {
            const day = dateStr.substring(0, 2); // Extract day from dd.mm.yyyy
            conditions.push({ date: { contains: `-${day}` } });
          }
          return conditions;
        };

        // Convert the filter if it is in the format dd.mm.yyyy
        const convertedFilter = convertDateFormat(filter);
        const isValidConvertedDate = convertedFilter && !isNaN(new Date(convertedFilter).getTime());

        const dateConditions = isValidConvertedDate ? [{ date: { equals: convertedFilter } }] : getPartialDateConditions(filter);

        const filterConditions = filter
          ? {
            OR: [
              { description: { contains: filter } },
              { location: { contains: filter } },
              ...dateConditions,
              ...(paymentTypeMatches.length > 0 ? [{ paymentType: { in: paymentTypeMatches } }] : []),
              ...(categoryMatches.length > 0 ? [{ category: { in: categoryMatches } }] : []),
              ...(isNaN(Number(filter)) ? [] : [{ amount: { equals: Number(filter) } }]),
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
