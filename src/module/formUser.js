const conn=require('../database/conn.js')


const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
  )
`;

conn.query(createUsersTable, (err, results) => {
  if (err) {
    console.error('Error creating users table:', err.stack);
    return;
  }
  console.log('Users table exists or was created successfully.');
});