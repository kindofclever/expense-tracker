import { mergeTypeDefs } from '@graphql-tools/merge';

import userTypeDef from './user.typeDef.js';
import transactionTypeDef from './transaction.typeDef.js';
import tagTypeDef from './tag.typeDef.js';

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef, tagTypeDef]);

export default mergedTypeDefs;