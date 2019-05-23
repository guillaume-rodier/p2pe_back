const bcrypt =require('bcrypt');
const jwt = require ('jsonwebtoken');
const dotenv = require('dotenv');

const Crypt = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Gnerate Token
   * @param {int} id
   * @returns {string} token
   */
  generateToken(id) {
    dotenv.config();
    const token = jwt.sign({
      userId: id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  },
  /**
  * Verify Tokem
  * @param {string} tokem
  * @return {int} userId
  */
  verifyToken(token) {
    dotenv.config();
    const decoded = jwt.verify(token, process.env.SECRET);
    return (decoded.userId);
  }
}

module.exports = Crypt;