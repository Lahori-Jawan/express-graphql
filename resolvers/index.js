const bcrypt = require('bcryptjs');
const { PubSub, withFilter, AuthenticationError, UserInputError } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client')
const { createToken } = require('../auth/token');

const dbClient = new PrismaClient()

// example data
const me = 'Nasir Khan';

// for subscriptions
const USER_CREATED = 'USER_CREATED';

const pubsub = new PubSub();

const resolvers = {
  Query: {
    hello: () => me,
    users: async () => await dbClient.user.findMany()
  },

  Mutation: {

    async signup(parent, args) {
      // 1
      const password = await bcrypt.hash(args.password, 10)
      // 2
      const user = await dbClient.user.create({
        data: {
          ...args, password
        }
      })
      
      // 3
      const { token } = createToken({ _id: user.id })
      await pubsub.publish(USER_CREATED, { userCreated: {user, token} });
      
      // 4
      return {
        token,
        user,
      }
    },

    async login(parent, args) {
      // 1
      const user = await dbClient.user.findOne({ where: { username: args.username } });

      if (!user) throw new UserInputError('No such user found')

      // 2
      const valid = await bcrypt.compare(args.password, user.password)

      if (!valid) throw new UserInputError('Invalid password')

      const { token } = createToken({ _id: user.id })
      console.log('login', {token, user});
      // 3
      return {
        token,
        user,
      }
    },

    async updateAccount(parent, args, context) {

      if(!context.user) throw new AuthenticationError('You must be logged in to perform this action')

      const id = context.user._id

      let { username, password = '',...rest } = args
      let user = null
      
      if(password.trim().length) {
        password = await bcrypt.hash(password, 10);
        rest.password = password;
      }

      try {
        
        user = await dbClient.user.update({ 
          where: { id },
          data: { ...rest }
        });
      
      } catch (error) {
      
        throw new UserInputError('No such user available')
      
      }    

      return user
    },

    async deleteAccount(parent, args, context) {

      if(!context.user) throw new AuthenticationError('You must be logged in to perform this action');

      const id = context.user._id

      try {
        
        await dbClient.user.delete({ where: { id } });
      
      } catch (error) {
      
        throw new UserInputError('No such user to delete')
      
      }

      return {
        message: 'Account deleted'
      }

    }

  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([USER_CREATED]),
    },
  }

};

module.exports = resolvers
