const { gql } = require('apollo-server-express');

const schema = gql`

  type Query {
    hello: String,
    users: [User]!
  }

  type Mutation {
    signup(firstname: String!, lastname: String!, username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    updateAccount(firstname: String, lastname: String, password: String): User!
    deleteAccount: Message!
  }

  type Subscription {
    userCreated: AuthPayload
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Message {
    message: String!
  }

  type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String!
  }

`;

module.exports = schema
