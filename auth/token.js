
const jwt = require('jsonwebtoken');

let customTokenSecret = process.env.TOKEN_SECRET || 'xyz007abcnk7891';
let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '#$!xyz007abcnk7891%&*';

const Token = {
  getToken(req) { 
    if( typeof req !== 'object' || !('headers' in req) ) {
      throw new Error('Invalid Authorization Header')
    }

    return req.headers.authorization || '' 
  },
  verifyToken(token, refreshToken) {
    const user = jwt.verify(token, customTokenSecret);    
    
    if(!user) {
      console.log('Error while verifying Token', token)
      throw new Error('Token is expired')
    }
    return user
  },
  createToken(payload, customDuration = '30s', refreshDuration = '7d') {
    console.log({createToken:payload})
    const token = jwt.sign(payload, customTokenSecret, {expiresIn: customDuration})
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {expiresIn: refreshDuration})
    
    return { token, refreshToken }
  },
}

module.exports = Token
