import { users } from "../dummyData/data.ts"
import { IResolvers } from "@graphql-tools/utils"

const userResolver: IResolvers = {
  Query: {
    users: () => {
      return users
    },
    user: (_, args: { userId: string }) => {
      return users.find(user => user._id === args.userId);
    }

  },

  Mutation: {}
}

export default userResolver