import userTypeDef from './user.typeDef.ts';
import transactionTypeDef from './transaction.typeDef.ts';
import { mergeTypeDefs } from '@graphql-tools/merge';

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default mergedTypeDefs;