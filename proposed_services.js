const pool = require("./db").pool;

const getAllProposed = (request, response) => {
  pool.query("SELECT * FROM proposed_services", (error, results) => {
    if (error) {
      response.status(400).send("Couldn't get the proposed_services");
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

const createProposed = (request, response) => {
  const {
    name,
    description,
    location,
    price,
    creation_date, //now()
    state, //1 at creation
    rate, //0 at initi
    option,
    id_pro
  } = request.body;

  pool.query(
    "INSERT INTO proposed_services VALUES (DEFAULT, $1, $2, $3, $4, now(), '1', 0.0, $5 ,$6) returning id",
    [
      name,
      description,
      location,
      price,
      option,
      id_pro
    ],
    (error, results) => {
      if (error) {
        console.log(error);

        response
          .status(400)
          .send(
            `Could not create the service proposal with the provided data`
          );
        return;
      }
      response.status(201).send(`Created the new service: ${results.rows[0].id}`);
      return;
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        response.status(400).send(`Couldn't update the user with ID: ${id}`);
        return;
      }
      response.status(200).send(`Service  deleted with ID: ${id}`);
      return;
    }
  );
};

const deleteProposed = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM proposed_services WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(400).send("Couldn't delete the service");
    }
    response.status(200).send(`Proposed Service deleted with ID: ${id}`);
  });
};

module.exports = {
  createProposed,
  getAllProposed,
  deleteProposed,
};
