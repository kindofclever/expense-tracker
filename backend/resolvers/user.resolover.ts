import { users } from "../dummyData/data.ts"

const userResolver = {
  Query: {
    users: () => {
      return users
    }
  },

  Mutation: {}
}

export default userResolver