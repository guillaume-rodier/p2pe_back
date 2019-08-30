const pool = require("./db").pool;
const Crypt = require ('./strategies/Crypt');

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      response.status(400).send("Ne peux pas récuprer l'utilisateur");
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
      response.status(400).send(`Il n y a pas d'utilisateur avec l'ID: ${id}`);
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
    return response.status(400).send({ 'message': 'entrer une email valide' });
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
            `Ne peux pas créer l'utilisateur avec la donnée recue: ${error.detail}`
          );
        return;
      }
      response.status(201).send(`Utilisateur crée ID: ${results.rows[0].id}`);
      return;
    }
  );
};

//TODO: Define what can be updated on a user profil
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);

  const { email, gender, address, phone, firstName, lastName, role, companyName, description, nbEmployes, siret, profession } = request.body;

  pool.query(
    "UPDATE users SET email = $1, gender = $2, address = $3, phone_number = $4, first_name = $5, last_name = $6, role = $7, company_name = $8, company_description = $9, number_employee = $10, siret = $11, profession = $12, town = $13, country = $14, postal_code = $15, image_screen = $16 WHERE id = $17",
    [email, gender, address, phone, firstName, lastName, role, companyName, description, nbEmployes, siret, profession, town, country, postal_code, image_screen, id],
    (error, results) => {
      if (error) {
        response.status(400).send(`Ne peux pas mettre a jour l'utilisateur: ${id}`);
        return;
      }
      response.status(200).send(`utilisateur mis à jour ID: ${id}`);
      return;
    }
  );

  // const { name, email } = request.body;
  //
  // pool.query(
  //   "UPDATE users SET name = $1, email = $2 WHERE id = $3",
  //   [name, email, id],
  //   (error, results) => {
  //     if (error) {
  //       response.status(400).send(`Ne peux pas mettre a jour l'utilisateur: ${id}`);
  //       return;
  //     }
  //     response.status(200).send(`utilisateur mis à jour ID: ${id}`);
  //     return;
  //   }
  // );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(400).send("Ne peux pas supprimer l'utilisateur");
    }
    response.status(200).send(`Utilisateur supprimé ID: ${id}`);
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
