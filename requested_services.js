const pool = require("./db").pool;

const getProRequested = (request, response) => { //7TODO: Creation des routes pour les request (ici requested pour un pro jointure sur 3 table)
  pool.query("SELECT * FROM proposed_services", (error, results) => {
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
const updateRequestedStateForPro = (request, response) => {
  const state = request.body.state
  const id = request.params.id
  pool.query("UPDATE requested_services SET state = $1 WHERE id = $2", [state,id], (error, results) => {
    if (error) {
      response.status(400).send(`Couldn't update the requested_service`)
    }
    response.status(200).send(`Status updated for the requested service  with id: ${id}.`);
    return
  })
}

const updatePaid = (req, res) => {
  const id = req.params.id
  const paid = req.body.paid
  pool.query("UPDATE requested_services SET paid = $1 WHERE id = $2", [paid, id], (error, results) => {
    if (error) {
      res.status(400).send(`Couldn't update the requested service`)
      console.log(error)
      return
    }
    res.status(200).send(`Updated the requested paid field with the id: ${id}.`);
    return
  })

}
const createRequested = (request, response) => {
  const {
    address,
    id_user,
    id_proposed
  } = request.body;

  pool.query(
    "INSERT INTO requested_services VALUES (DEFAULT, 'Pending', '0', now() , $1, now() + INTERVAL '1 DAYS',$2, $3) returning id",
    [
        address,
        id_user,
        id_proposed
    ],
    (error, results) => {
      if (error) {
        console.log(error);

        response
          .status(400)
          .send(
            `Could not create the request for that service with the provided data`
          );
        return;
      }
      response.status(201).send(`Created the new request: ${results.rows[0].id}`);
      return;
    }
  );
};

const deleteRequested = (request, response) => {
  const id = request.params.id;

  pool.query("DELETE from requested_services WHERE id = $1", [id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).send("Couldn't delete the service");
      return
    }
    response.status(200).send(`Requested_services with ID: ${id} deleted`);
    return
  });
};

module.exports = {
    createRequested,
    updateRequestedStateForPro,
    updatePaid,
    deleteRequested,
};
