const db = require("./db");
const Crypt = require ('./strategies/Crypt');
const pool = require('./db').pool
const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const users = require('./users')
const proposed_services = require('./proposed_services')
const requested_services = require('./requested_services')
const app = express()
const cors = require("cors");
const port = 3000


//Database init

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Could not connect to the database");
    pool.end()
  }
});
db.createTables();


app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get(
  "/users",
  Crypt.verifyToken,
  users.getUsers
);

app.get("/users/:id",Crypt.verifyToken, users.getUserById);
app.put("/users/:id", Crypt.verifyToken, users.updateUser);
app.delete("/users/:id", Crypt.verifyToken, users.deleteUser);
app.post('/users', users.createUser)

//PROPOSED SERVICES
app.post("/proposed_services", Crypt.verifyToken, proposed_services.createProposed)
app.get("/proposed_services", Crypt.verifyToken, proposed_services.getAllProposed)
app.put("/proposed_services/:id/state", Crypt.verifyToken, proposed_services.updateProposedState) //set the service to disabled
app.put("/proposed_services/:id/", Crypt.verifyToken, proposed_services.updateProposedWithId)
app.delete("/proposed_services/:id", Crypt.verifyToken, proposed_services.deleteProposed)
app.get("/proposed_services/:id", Crypt.verifyToken, proposed_services.getProposedById)

//PRO
app.get("/pro/:id_pro/proposed_services", Crypt.verifyToken, proposed_services.getProProposed)
app.put("/pro/:id_pro/proposed_services/state", Crypt.verifyToken, proposed_services.updateProposedStatePro)//same but for all services with pro id


//REQUESTED SERVICES
app.post("/requested_services/", Crypt.verifyToken, requested_services.createRequested)//same but for all services with pro id
app.put("/requested_services/:id/state", Crypt.verifyToken, requested_services.updateRequestedStateForPro)
app.put("/requested_services/:id/paid", Crypt.verifyToken, requested_services.updatePaid)
app.delete("/requested_services/:id", Crypt.verifyToken, requested_services.deleteRequested)

app.get("/users/:id/requested_services", Crypt.verifyToken, requested_services.getRequestedUser)
app.get("/pro/:id/requested_services/extend", Crypt.verifyToken, requested_services.getRequestedPro)
app.get("/users/:id/requested_services/extend", Crypt.verifyToken, requested_services.getRequestedForUserExtended)
app.get("/pro/:id/requested_services/", Crypt.verifyToken, requested_services.getRequestedProWithoutDetails)






//LOGIN
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
              const token = Crypt.generateToken(current_user.id, current_user.email, current_user.role);
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
    const userId = Crypt._verifyToken(request.body.token);
    return response.status(200).json({
      message: "Authification secure OK!",
      userId
      })
  } catch(err) {
    return response.status(400).json({message: err});
  }
})

app.get("/protected", Crypt.verifyToken, (req, res) => {
  return res.status(200).send("YAY! this is a protected Route")
})

app.listen(3000, () => {
  console.log(`App running on port ${port}.`);
});
