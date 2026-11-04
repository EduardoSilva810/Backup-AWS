const { Pool } = require('pg');

const pool = new Pool({
	user: 'sistem_user',
	host: 'localhost',
	database: 'sistema_chamados',
	password: 'abcd1234',
	port: 5432
});

module.exports = pool;
