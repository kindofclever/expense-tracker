import { transactions } from "../dummyData/data.ts"

const transactionResolver = {
  Query: {
    transactions: () => {
      return transactions
    }
  },

  Mutation: {}
}

export default transactionResolver