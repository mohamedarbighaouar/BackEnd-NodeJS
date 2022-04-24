const mysql = require('mysql')
const { Pool } = require('pg')


 pool = mysql.createPool({
    host      : process.env.DATABASE_HOST,
    user      : process.env.DATABASE_USER,
    password  : process.env.DATABASE_PASSWORD,
    database  : process.env.DATABASE_NAME,
  });

  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * FROM utilisateur', function (error, results, fields) {
      // And done with the connection.
      connection.release();
  
      // Handle error after the release.
      if (error) throw error;
      
      // Don't use the connection here, it has been returned to the pool.
    });
  });
