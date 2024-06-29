import express from "express";

export interface SignUpInput {
  username: string;
  name: string;
  password: string;
  gender: 'male' | 'female' | 'diverse';
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface MyContext {
  token?: string;
  req: express.Request;
  res: express.Response;
  user?: User;
}

export interface User {
  id: number;
  username: string;
  name: string;
  password: string;
  profilePicture: string;
  gender: Gender;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  description: string;
  paymentType: PaymentType;
  category: string;
  amount: number;
  location?: string;
  date: string;
  userId: number;
  user: User;
}

export interface CreateTransactionInput {
  description: string;
  paymentType: PaymentType;
  category: string;
  amount: number;
  date: string;
  location?: string;
}

export interface UpdateTransactionInput {
  transactionId: string;
  description?: string;
  paymentType?: PaymentType;
  category?: string;
  amount?: number;
  location?: string;
  date?: string;
}


// enums.ts

export enum Gender {
  Male = 'male',
  Female = 'female',
  Diverse = 'diverse',
}

export enum PaymentType {
  Cash = 'cash',
  Debit = 'debit',
  Credit = 'credit',
  Twint = 'twint',
}