const bcrypt =require('bcrypt');
const jwt = require ('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../db').pool;


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
  generateToken(id, email, role) {
    dotenv.config();
    const token = jwt.sign({
      userId: id,
      userEmail: email,
      userRole: role
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
  _verifyToken(token) {
    dotenv.config();
    const decoded = jwt.verify(token, process.env.SECRET);
    return (decoded.userId);
  },

  /**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */
  async verifyToken(req, res, next) {

    dotenv.config();
    const token = req.headers['x-access-token'];
    if(!token) {
      return res.status(400).send({ 'message': 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await pool.query(text, [decoded.userId]);
      if(!rows[0]) {
        return res.status(400).send({ 'message': 'The token you provided is invalid' });
      }
      req.user = { id: decoded.userId };
      next();
    } catch(error) {

      return res.status(400).send(error);
    }
  }
}

module.exports = Crypt;