const pool = require('./db').pool
const bcrypt = require('bcrypt');
const saltRounds = 10;


const getUsers = (request, response) => {
    pool.query('SELECT * FROM users2', (error, results) => {
      if (error) {
          response.status(400).send('Couldn t get the users') 
        }
      response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users2 WHERE userid = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`User added with ID: ${id}`)
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  
const  { email,password,gender,address,phone_number,first_name,last_name,role,company_name,company_description,number_employee,siret,state,profession } = request.body 

pool.query('INSERT INTO users2 VALUES (default, $1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING userid',
[email,password,gender,address,phone_number,first_name,last_name,role,company_name,company_description,number_employee,siret,state,profession], 
(error, results) => {
    if (error) {
      console.log(error)

      response.status(400).send(`Could not create the user with the provided data`)
      return
    }
    response.status(201).send(`User added with ID: ${results.rows[0].userid}`)
    return
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users2 SET name = $1, email = $2 WHERE userid = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        response.status(400).send(`Couldn't update the user with ID: ${id}`)
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users2 WHERE userid = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send("Couldn't delete the user")
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}