import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import express from 'express';
import session from 'express-session';
import MySQLStoreImport from 'express-mysql-session';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';

import { configurePassport } from './passport.config.ts';
import mergedTypeDefs from './typeDefs/index.ts';
import mergedResolvers from './resolvers/index.ts';
import { connectToDb } from './dataBase/connectToDb.ts';


dotenv.config();
connectToDb();
configurePassport();

const app = express();
const httpServer = http.createServer(app);

const MySQLStore = MySQLStoreImport(session as any);

// Session store configuration
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '2342'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(
  session({
    name: 'mysql',
    secret: process.env.SESSION_SECRET ?? '',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>({ origin: 'http://localhost:3000', credentials: true }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return {
        req,
        res,
        user: req.user,
        login: req.login.bind(req),
        logout: req.logout.bind(req),
        getUser: () => req.user,
      };
    },
  }),);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
