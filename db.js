const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'docker',
  port: 5432,
})

const createTables = () => {
  
  pool.query('CREATE TABLE IF NOT EXISTS users2 (id Serial PRIMARY KEY,email VARCHAR UNIQUE,password VARCHAR,gender VARCHAR,address VARCHAR,phone_number VARCHAR UNIQUE,first_name VARCHAR,last_name VARCHAR,role VARCHAR,company_name VARCHAR,company_description VARCHAR,number_employee INTEGER,siret VARCHAR UNIQUE,state VARCHAR,profession VARCHAR)', (error, results) => {
    if (error) {
        console.log('Cannot create tables users2 : ' + error.message) 
        return
      }
    console.info('table users created')
  })
  pool.query('CREATE TABLE IF NOT EXISTS proposed_services (id SERIAL, name VARCHAR, description VARCHAR, location VARCHAR, price FLOAT, creation_date TIME, state VARCHAR, rate FLOAT, option VARCHAR, id_pro SERIAL, PRIMARY KEY (id), FOREIGN KEY (id_pro) REFERENCES users2(id))', (error, results) => {
    if (error) {
        console.log('Cannot create tables proposed_services : ' + error) 
        return
      }
    console.log('table proposed_services created')
  })
  pool.query('CREATE TABLE IF NOT EXISTS requested_services (id SERIAL, state VARCHAR, paid VARCHAR, creation_date TIME, address VARCHAR, expiration_date TIME, id_user SERIAL, id_proposed SERIAL, PRIMARY KEY (id), FOREIGN KEY (id_user) REFERENCES users2(id), FOREIGN KEY (id_proposed) REFERENCES proposed_services(id))', (error, results) => {
    if (error) {
      console.log('Cannot create tables requested_services : ' + error.message, results) 
      return   
    }
    console.log('table requested_services created')
  })
}

const dropTables = () => {
  pool.query('DROP TABLE IF EXISTS users2', (error, results) => {
    if (error) {
        console.log('cannot drop tables : ' + error.message ) 
      }
    console.log(results)
  })
}

module.exports = {
    pool,
    createTables,
}