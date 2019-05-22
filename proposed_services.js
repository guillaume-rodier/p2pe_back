const pool = require("./db").pool

const getAllProposed = (request, response) => {
  pool.query("SELECT * FROM proposed_services where state = '1'", (error, results) => {
    if (error) {
      response.status(400).send("Couldn't get the proposed_services");
      return;
    }
    if (typeof results !== "undefined" && results.rows.length > 0) {
      response.status(200).json(results.rows);
    } else {
      response.status(400).send("Couldn't get the proposed_services");
      return;
    }
  });
};
const getProposedById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM proposed_services WHERE id = $1", [id], (error, results) => {
    
    if (error || results.rows.length <= 0) {
      response.status(400).send(`There is no proposed service with the ID: ${id}`);
      return;
    }
    response.status(200).json(results.rows);
    return;
  });
};
const getProProposed = (request, response) => {
  const id_pro = request.params.id_pro
  //parseInt(request.params.id);

  pool.query("SELECT * FROM proposed_services WHERE id_pro = $1", [id_pro], (error, results) => {
    
    if (error || results.rows.length <= 0) {
      response.status(400).send(`There is no proposed service with the ID: ${id_pro}`);
      return;
    }
    response.status(200).json(results.rows);
    return;
  });
};

//this function modify the proposed service' state
const updateProposedState = (request, response) => {
  const state = request.body.state
  const id = parseInt(request.params.id)

  pool.query("UPDATE proposed_services SET state = $1 WHERE id = $2", [state,id], (error, results) => {
    if (error) {
      response.status(400).send(`Something went wrong`)
    }
    response.status(200).send(`Status updated for the proposed service with id: ${id}`);
    return
  })
}
//same but for a specified pro (global action on all proposed services)
const updateProposedStatePro = (request, response) => {
  const state = request.body.state
  const id_pro = parseInt(request.params.id_pro)
  pool.query("UPDATE proposed_services SET state = $1 WHERE id_pro = $2", [state,id_pro], (error, results) => {
    if (error) {
      response.status(400).send(`Something went wrong`)
    }
    response.status(200).send(`Status updated for the proposed service of the pro with id: ${id_pro}.`);
    return
  })
}

const updateProposedWithId = (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const description =  req.body.description
  const price = parseFloat(req.body.price)

  pool.query("UPDATE proposed_services SET name = $1, description = $2, price = $3 WHERE id = $4", [name,description, price, id], (error, results) => {
    if (error) {
      res.status(400).send(`Something went wrong`)
    }
    res.status(200).send(`Updated the proposed service with the id: ${id}.`);
    return
  })

}
const createProposed = (request, response) => {
  const {
    name,
    description,
    location,
    price,
    creation_date, //now()
    state, //1 at creation
    rate, //0 at init
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
  getProProposed,
  deleteProposed,
  getProposedById,
  updateProposedState,
  updateProposedStatePro,
  updateProposedWithId,
};
