const { gql } = require("apollo-server");

/**
 * Type Definitions for our Schema using the SDL.
 */
const typeDefs = gql`
  enum PetTypes {
    Dog
    Cat
    Fish
    Bunny
  }
  type User {
    id: ID!
    username: String!
    pets: [Pet]!
  }
  type Pet {
    id: ID!
    createdAt: String!
    name: String!
    type: PetTypes!
    img: String
    user: User!
  }
  input PetsInput {
    type: String
    id: ID
  }
  type Query {
    pets(input: PetsInput): [Pet]!
    pet(input: PetsInput): Pet
  }
  input PetCreateInput {
    name: String!
    type: PetTypes!
    user: ID!
  }
  type Mutation {
    pet(input: PetCreateInput!): Pet!
  }
`;

module.exports = typeDefs;
