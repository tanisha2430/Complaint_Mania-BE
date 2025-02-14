const conn = require('../database/conn.js');

const createAdminTable = `
  CREATE TABLE IF NOT EXISTS admin (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
  )
`;

conn.query(createAdminTable, (err, results) => {
  if (err) {
    console.error('Error creating admin table:', err.stack);
    return;
  }
  console.log('Admin table exists or was created successfully.');
});
