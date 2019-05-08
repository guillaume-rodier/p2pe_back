const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const app = express()
const port = 3000

//TODO: Externalize all the config stuff into config.js (port, DB and so on...).
/* //Bycrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//TODO: Use that in order to create the inscription handler and modify the login route in order to compare hash (Watch out about the JWT management handlers)
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
      // Store hash in your password DB.
  });
});

// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
  // res == true
});
 */
//jwt stuff
const secret = config.secret//normally stored in process.env.secret
const jwt = require("jsonwebtoken");
const opts = {}

//passport stuff
const passport = require("passport");
const jwtStrategry  = require("./strategies/jwt")
passport.use(jwtStrategry);



app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})



app.get('/users', passport.authenticate('jwt', { session: false }),db.getUsers) //TODO: Find a fancier way to secure the routes (maybe with a express router)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)


app.post("/login", (req, res) => {
  let { email, password } = req.body;
  //This lookup would normally be done using a database
  if (email === "aa") {
      if (password === "aaa") { //Change the verification mechanism-> DB TODO: Check Bycrpt pour stocquer un hash et les comparer
          opts.expiresIn = '24h';  //token expires in 2min
          const token = jwt.sign({ email, password }, secret, opts);
          return res.status(200).json({
              message: "Auth Passed",
              token
          })
      }
  }
  return res.status(401).json({ message: "Auth Failed" })
});

app.get("/protected", passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(200).send("YAY! this is a protected Route")
})
app.listen(3000, () => {
  console.log(`App running on port ${port}.`)
})



