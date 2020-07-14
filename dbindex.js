const { Pool } = require("pg");

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'baccara06',
    port: 5432
});

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
})
