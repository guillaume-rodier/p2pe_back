const pool = require("./db").pool;

const getRequestedUser = (request, response) => {
  //7TODO: Creation des routes pour les request (ici requested pour un pro jointure sur 3 table)
  pool.query(
    "SELECT * FROM requested_services WHERE id_user = $1",
    [request.params.id],
    (error, results) => {
      if (error) {
        response.status(400).send("Ne peut pas récuperer le service requété");
        return;
      }
      response.status(200).json(results.rows);
      return;
    }
  );
};

const getRequestedForUserExtended = (request, response) => {
  const id = request.params.id;
  const query = `SELECT
          proposed_services.id as proposed_id,
          proposed_services.name as proposed_name,
          proposed_services.description as proposed_description,
          proposed_services.location   as proposed_location,
          proposed_services.price  as proposed_price,
          proposed_services.creation_date   as proposed_creation_date,
          proposed_services.state   as proposed_state,
          proposed_services.rate   as proposed_rate,
          proposed_services.option   as proposed_option,
          proposed_services.id_pro   as proposed_id_pro,
          requested_services.id as requested_id,
          requested_services.code as requested_code,
          requested_services.state as requested_state,
          requested_services.paid as requested_paid,
          requested_services.creation_date as requested_creation_date,
          requested_services.address as requested_address,
          requested_services.expiration_date as requested_expiration_date,
          requested_services.id_user as requested_id_user,
          requested_services.id_proposed as requested_id_proposed
  FROM requested_services
  INNER JOIN proposed_services
  ON requested_services.id_proposed = proposed_services.id
  WHERE requested_services.id_user = $1`;
  pool.query(query, [id], (error, results) => {
    if (error) {
      console.log(error);
      response.status(400).send(`Error while requesting the data`);
      return;
    }
    console.log(result)
    response.status(200).json(results.rows);
    return;
  });
};

const getRequestedPro = (request, response) => {
  const id = request.params.id;
  const query = `SELECT
          proposed_services.id as proposed_id,
          proposed_services.name as proposed_name,
          proposed_services.description as proposed_description,
          proposed_services.location   as proposed_location,
          proposed_services.price  as proposed_price,
          proposed_services.creation_date   as proposed_creation_date,
          proposed_services.state   as proposed_state,
          proposed_services.rate   as proposed_rate,
          proposed_services.option   as proposed_option,
          proposed_services.id_pro   as proposed_id_pro,
          requested_services.id as requested_id,
          requested_services.code as requested_code,
          requested_services.state as requested_state,
          requested_services.paid as requested_paid,
          requested_services.creation_date as requested_creation_date,
          requested_services.address as requested_address,
          requested_services.expiration_date as requested_expiration_date,
          requested_services.id_user as requested_id_user,
          requested_services.id_proposed as requested_id_proposed
  FROM requested_services
  INNER JOIN proposed_services
  ON requested_services.id_proposed = proposed_services.id
  WHERE proposed_services.id_pro = $1`;
  pool.query(query, [id], (error, results) => {
    if (error) {
      response.status(400).send(`N existe pas pour ID: ${id}`);
      return;
    }
    response.status(200).json(results.rows);
    return;
  });
};

const updateRequestedStateForPro = (request, response) => {
  const state = request.body.state;
  const id = request.params.id;
  pool.query(
    "UPDATE requested_services SET state = $1 WHERE id = $2",
    [state, id],
    (error, results) => {
      if (error) {
        response.status(400).send(`Ne peut pas mettre a jour le service`);
      }
      response
        .status(200)
        .send(`Ne peut pas mettre à jour le status du service id: ${id}.`);
      return;
    }
  );
};

const updatePaid = (req, res) => {
  const id = req.params.id;
  const paid = req.body.paid;
  pool.query(
    "UPDATE requested_services SET paid = $1 WHERE id = $2",
    [paid, id],
    (error, results) => {
      if (error) {
        res.status(400).send(`Ne peux pas mettre a jour la state du service`);
        console.log(error);
        return;
      }
      res.status(200).send(`Etat mise à jour`);
      return;
    }
  );
};

const createRequested = (request, response) => {
  const { address, id_user, id_proposed, code } = request.body;

  pool.query(
    "INSERT INTO requested_services VALUES (DEFAULT, 'Pending', '0', now() , $1, now() + INTERVAL '1 DAYS',$2, $3, $4) returning id",
    [address, id_user, id_proposed, code],
    (error, results) => {
      if (error) {
        console.log(error);

        response.status(400).send(`Ne peux pas créer le service`);
        return;
      }
      response.status(201).send(`Service Créer: ${results.rows[0].id}`);
      return;
    }
  );
};

const deleteRequested = (request, response) => {
  const id = request.params.id;

  pool.query(
    "DELETE from requested_services WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(400).send("Ne peux pas supprimer le service");
        return;
      }
      response.status(200).send(`Suppression du service ID: ${id} deleted`);
      return;
    }
  );
};

const getRequestedProWithoutDetails = (request, response) => {
  const proId = request.params.id;
  const text =
    "SELECT * FROM requested_services WHERE requested_services.id_proposed IN" +
    "(SELECT proposed_services.id FROM proposed_services WHERE proposed_services.id_pro = $1)";
  pool.query(text, [proId], (error, results) => {
    if (error) {
      console.log(error);
      response
        .status(400)
        .send(`Ne peux pas récuperer le service pour le pro: ${proId}`);
      return;
    }
    response.status(200).send(results.rows);
  });
};

module.exports = {
  createRequested,
  updateRequestedStateForPro,
  updatePaid,
  deleteRequested,
  getRequestedUser,
  getRequestedPro,
  getRequestedForUserExtended,
  getRequestedProWithoutDetails
};
