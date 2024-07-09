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

        // Check for partial matches in enums
        const getPartialEnumMatches = (filter, enumObject) =>
          Object.values(enumObject).filter(enumValue =>
            enumValue.toString().toLowerCase().includes(filter.toLowerCase())
          );

        // Convert the filter if it is in the format dd.mm.yyyy
        const convertDateFormat = (dateStr) => {
          const parts = dateStr.split('.');
          return parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4
            ? `${parts[2]}-${parts[1]}-${parts[0]}`
            : null;
        };

        // Create date conditions for partial date matches
        const getPartialDateConditions = (dateStr) => {
          const conditions = [];
          if (dateStr.length >= 4) conditions.push({ date: { contains: dateStr.slice(-4) } }); // Year
          if (dateStr.length >= 7) conditions.push({ date: { contains: `-${dateStr.slice(3, 5)}-` } }); // Month
          if (dateStr.length === 10) conditions.push({ date: { contains: `-${dateStr.slice(0, 2)}` } }); // Day
          return conditions;
        };

        const paymentTypeMatches = getPartialEnumMatches(filter, PaymentType);
        const categoryMatches = getPartialEnumMatches(filter, Category);
        const convertedFilter = convertDateFormat(filter);
        const isValidConvertedDate = convertedFilter && !isNaN(new Date(convertedFilter).getTime());

        const dateConditions = isValidConvertedDate ? [{ date: { equals: convertedFilter } }] : getPartialDateConditions(filter);

        const filterConditions = filter ? {
          OR: [
            { description: { contains: filter } },
            { location: { contains: filter } },
            ...dateConditions,
            ...(paymentTypeMatches.length ? [{ paymentType: { in: paymentTypeMatches } }] : []),
            ...(categoryMatches.length ? [{ category: { in: categoryMatches } }] : []),
            ...(isNaN(Number(filter)) ? [] : [{ amount: { equals: Number(filter) } }])
          ],
        } : {};

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
    deleteAllTransactions: async (_, { userId }: { userId: string }, context: any): Promise<{ success: boolean; message: string }> => {
      try {
        const user = await context.getUser();
        if (!user || user.id !== parseInt(userId)) throw new Error("Unauthorized");

        await prisma.transaction.deleteMany({
          where: { userId: parseInt(userId) },
        });

        return { success: true, message: "All transactions have been successfully deleted." };
      } catch (err: unknown) {
        console.error("Error deleting all transactions:", err);
        return { success: false, message: "Error deleting all transactions." };
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
