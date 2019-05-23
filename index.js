const Crypt = require ('./strategies/Crypt');
const pool = require('./db').pool
const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const users = require('./users')
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



app.get('/users', passport.authenticate('jwt', { session: false }),users.getUsers) //TODO: Find a fancier way to secure the routes (maybe with a express router)
app.get('/users/:id', users.getUserById)
app.get('/users/:email', users.getUserByEmail)
app.post('/users', users.createUser)
app.put('/users/:id', users.updateUser)
app.delete('/users/:id', users.deleteUser)


app.post("/login", (request, response) => {
    //Test if data are conform
    if (!request.body.email || !request.body.password) {
      return response.status(400).json({message: "Some values are missing"});
    }
    if (!Crypt.isValidEmail(request.body.email)) {
      return response.status(400).json({message: "The credentials you provided is incorrect: Please enter a valid email address"});
      }

    //Find account linked to this email
    const text = "SELECT * FROM users WHERE email = $1";
      pool.query(text, [request.body.email])
        //email linked
        .then((res) => {
            const current_user = res.rows[0];
            if(!Crypt.comparePassword(current_user.password, request.body.password)) {
              return response.status(400).json({message: "The credentials you provided is incorrect: password incorrect"});
            } else {
              //console.log(process.env.SECRET);
              const token = Crypt.generateToken(current_user.id);
              return response.status(200).json({
                message: "Connected!",
                token
              });
            }
        })
        //Email does not match
        .catch((err) => {
            return response.status(400).json({message: "This email does not refer to any account"});
        });
});

//???? Verifie letoken delivre a la connexion
app.post("/_login", (request, response) => {
  try {
    const userId = Crypt.verifyToken(request.body.token);
    return response.status(200).json({
      message: "Authification secure OK!",
      userId
      })
  } catch(err) {
    return response.status(400).json({message: err});
  }
})

app.get("/protected", passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(200).send("YAY! this is a protected Route")
})
app.listen(3000, () => {
  console.log(`App running on port ${port}.`)
})



