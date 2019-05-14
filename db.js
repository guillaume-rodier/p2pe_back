const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'docker',
  port: 5432,
})

module.exports = {
    pool,
}