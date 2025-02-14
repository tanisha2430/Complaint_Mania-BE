// const mysql = require('mysql');

// console.log("hosttttttttttttttttttttt",process.env.MYSQLHOST);


// const conn = mysql.createConnection({
//   host:process.env.MYSQLHOST,
//   user: process.env.MYSQLUSER,
//   password: process.env.MYSQL_ROOT_PASSWORD, // Use the password you set
//   database: process.env.MYSQL_DATABASE         // Ensure this database exists
// });

// conn.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err.stack);
//     return;
//   }
//   console.log('Connected to the database.');
// });

// module.exports = conn;


const mysql = require('mysql2');
const url = require('url');  // Import the 'url' module

// Connection string (you should replace this with your environment variable)
const connectionString = process.env.MYSQL_CONNECTION_URL;

// Parse the connection string using the URL module
const parsedUrl = url.parse(connectionString);

// Extract the relevant parts from the parsed URL
const host = parsedUrl.hostname;
const user = parsedUrl.auth.split(':')[0];  // Extract username from the auth part
const password = parsedUrl.auth.split(':')[1];  // Extract password from the auth part
const port = parsedUrl.port;
const database = parsedUrl.path.split('/')[1];  // Extract the database name from the path

console.log("hosttttttttttttttttttttt", host);

// Create a MySQL connection using the parsed details
const conn = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  port: port,  // Port is included in the URL
  database: database  // Database is included in the URL
});

// Connect to the database
conn.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = conn;
