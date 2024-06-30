import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDb = async (): Promise<void> => {
  try {
    await prisma.$connect();
  } catch (error) {
    process.exit(1);
  }
};

export default prisma;