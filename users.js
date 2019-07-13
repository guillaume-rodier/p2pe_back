const pool = require("./db").pool;
const Crypt = require ('./strategies/Crypt');

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      response.status(400).send("Couldn t get the users");
      return;
    }
    if (typeof results !== "undefined" && results.rows.length > 0) {
      response.status(200).json(results.rows);
    }
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error || results.rows.length <= 0) {
      response.status(400).send(`There is no user with the ID: ${id}`);
      return;
    }
    response.status(200).json(results.rows);
    return;
  });
};

//??? useless ou remplacer le logim email in imdex.js
const getUserByEmail = (request, response) => {
  const email= request.params.email;

  if (Crypt.isValidEmail(email)) {
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
      if (error) {
        response.status(400).send(`User added with email: ${email}`)
      }
      response.status(200).json(results.rows)
    })
  } else {
    response.status(400).send(`incorrect email`)
  }
}


const createUser = (request, response) => {
  const {
    email,
    password,
    gender,
    address,
    phone_number,
    first_name,
    last_name,
    role,
    company_name,
    company_description,
    number_employee,
    siret,
    profession
  } = request.body;


  if (!Crypt.isValidEmail(email)) {
    return response.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  const hashPassword = Crypt.hashPassword(password);

  pool.query('INSERT INTO users VALUES (default, $1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id',
  [
    email,
    hashPassword,
    gender,
    address,
    phone_number,
    first_name,
    last_name,
    role,
    company_name,
    company_description,
    number_employee,
    siret,
    0,
    profession
  ], (error, results) => {
    if (error) {
        response
          .status(400)
          .send(
            `Could not create the user with the provided data: ${error.detail}`
          );
        return;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
      return;
    }
  );
};

//TODO: Define what can be updated on a user profil
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET first_name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        response.status(400).send(`Couldn't update the user with ID: ${id}`);
        return;
      }
      response.status(200).send(`User updated with ID: ${id}`);
      return;
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(400).send("Couldn't delete the user");
    }
    response.status(200).send(`Deleted User with ID: ${id}`);
    return
  });
};

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
};
