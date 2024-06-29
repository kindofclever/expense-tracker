import { mergeTypeDefs } from '@graphql-tools/merge';

import userTypeDef from './user.typeDef.ts';
import transactionTypeDef from './transaction.typeDef.ts';

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default mergedTypeDefs;