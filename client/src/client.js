import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { ApolloLink } from "apollo-link";
import gql from "graphql-tag";

const delay = setContext(
  (request) =>
    new Promise((success, fail) => {
      setTimeout(() => {
        success();
      }, 800);
    })
);

const cache = new InMemoryCache();
const http = new HttpLink({
  uri: "http://localhost:4000/",
});

const typeDefs = gql`
  extend type User {
    age: Int
  }
  extend type Pet {
    vaccinated: Boolean!
  }
`;

const resolvers = {
  User: {
    age() {
      return 22;
    },
  },
  Pet: {
    vaccinated() {
      return true;
    },
  },
};

const link = ApolloLink.from([delay, http]);
const client = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers,
});

export default client;
