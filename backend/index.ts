import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mergedTypeDefs from './typeDefs/index.ts';
import mergedResolvers from './resolvers/index.ts';


interface MyContext {
  token?: String;
}

const server = new ApolloServer<MyContext>({ typeDefs: mergedTypeDefs, resolvers: mergedResolvers });
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ token: req.headers.token }),
  listen: { port: 4000 },
});
console.log(`🚀  Server ready at ${url}`);