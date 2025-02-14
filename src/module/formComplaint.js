const conn=require('../database/conn.js')


const createComplaintTable = `
  CREATE TABLE IF NOT EXISTS complaints (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
  )
`;

conn.query(createComplaintTable, (err, results) => {
  if (err) {
    console.error('Error creating complaint table:', err.stack);
    return;
  }
  console.log('Complaint was registered successfully.');
});