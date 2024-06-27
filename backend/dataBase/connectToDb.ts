import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDb = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Connected to MySQL database using Prisma');
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    process.exit(1);
  }
};

export default prisma;