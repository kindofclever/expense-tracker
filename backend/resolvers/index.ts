import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "./user.resolover.js";
import transactionResolver from "./transaction.resolver.js";
import tagResolver from "./tag.resolver.js";

const mergedResolvers = mergeResolvers([userResolver, transactionResolver, tagResolver])

export default mergedResolvers