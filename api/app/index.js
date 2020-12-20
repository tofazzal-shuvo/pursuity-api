import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./graphql";
import {
  isAuthenticated,
  isAdmin,
  isShopper,
  isBusiness,
} from "./graphql/directives";
import { jwtDecode } from "./utility/jwt";
require("../boot/cDatabase");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated,
    isAdmin,
    isShopper,
    isBusiness,
  },
  context: async ({ req, connection }) => {
    try {
      const token = (req.headers.authorization || "").replace("Bearer ", "");
      const user = jwtDecode(token);
      return { user: { ...user, token } };
    } catch (error) {
      return { user: null };
    }
  },
  tracing: true,
  introspection: true,
  playground: true,
});

const PORT = process.env.PORT || 6000;

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
