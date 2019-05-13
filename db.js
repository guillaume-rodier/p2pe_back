const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'docker',
  port: 5432,
})

//

const createTables = (request, response) => {
  pool.query('CREATE TABLE IF NOT EXISTS users(userId SERIAL, birthday TIME, gender VARCHAR, address VARCHAR, email VARCHAR, phoneNumber VARCHAR, firstName VARCHAR, lastName VARCHAR, role VARCHAR, companyName VARCHAR, siret VARCHAR, companyDescription VARCHAR, numberOfEmployee INT, state VARCHAR, profession VARCHAR, UNIQUE(userId, phoneNumber, email, companyName, siret), PRIMARY KEY (userId))', (error, results) => {
    if (error) {
        console.log('Cannot create tables users : ' + error.message) 
      }
    console.log(results)
  })
  pool.query('CREATE TABLE IF NOT EXISTS proposed_services(serviceId SERIAL, name VARCHAR, description VARCHAR, location VARCHAR, price FLOAT, creationDate TIME, state VARCHAR, rate FLOAT, option VARCHAR, proId SERIAL, PRIMARY KEY (serviceId), FOREIGN KEY (proId) REFERENCES users(userId))', (error, results) => {
    if (error) {
        console.log('Cannot create tables proposed_services : ' + error.message) 
      }
    console.log(results)
  })
  pool.query('CREATE TABLE IF NOT EXISTS requested_services(requestId SERIAL, state VARCHAR, paid VARCHAR, serviceDate TIME, address VARCHAR, expirationDate TIME, customerId SERIAL, serviceId SERIAL, PRIMARY KEY (requestId), FOREIGN KEY (customerId) REFERENCES users(userId), FOREIGN KEY (serviceId) REFERENCES proposed_services(serviceId))', (error, results) => {
    if (error) {
        console.log('Cannot create tables requested_services : ' + error.message) 
      }
    console.log(results)
  })
}

const dropTables = (request, response) => {
  pool.query('DROP TABLE IF EXISTS users', (error, results) => {
    if (error) {
        console.log('cannot drop tables : ' + error.message ) 
      }
    console.log(results)
  })
}

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) {
          response.status(400).send('Couldn t get the users') 
        }
      response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`User added with ID: ${id}`)
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email], (error, results) => {
    if (error) {
      response.status(400).send(`Could not create the user with the provided data`)
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        response.status(400).send(`Couldn't update the user with ID: &{id}`)
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
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
    dropTables,
    createTables,
   }