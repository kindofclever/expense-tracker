import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "./user.resolover.ts";
import transactionResolver from "./transaction.resolver.ts";

const mergedResolvers = mergeResolvers([userResolver, transactionResolver])

export default mergedResolvers