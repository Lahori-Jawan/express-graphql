// const { ApolloServer } = require('apollo-server');
const { createServer } = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { verifyToken, getToken } = require('./auth/token');


const PORT = process.env.PORT || 4000

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: async ({ req }) => {

    if(!req) return {}
    
    const token = getToken(req);
    
    const user = token.length ? verifyToken(token) : null

    if (!user) return {}

    return { user }
  }
});

const app = express();
const httpServer = createServer(app);

server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});
