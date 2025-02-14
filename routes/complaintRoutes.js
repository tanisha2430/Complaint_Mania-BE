const express = require('express');
const {protectRoute,adminRoute}=require('../middleware/protectedRoutes.js')
const routerComplaint = express.Router();
const conn = require('../src/database/conn.js'); 

// Define the route to get all users
routerComplaint.get('/complaint',adminRoute,(req, res) => {
  const query = 'SELECT * FROM complaints';
  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching complaint:', err.stack);
      res.status(500).json({error:'Error fetching complaint'});
      return;
    }
    res.json(results);
  });
});

// Generating a unique id for users
function generateUnique4DigitNumber() {
  const year = 2024;
  const min = 1000; // Minimum 4-digit number
  const max = 9999; // Maximum 4-digit number

  const generatedNumbers = new Set(); // Keep track of generated numbers

  // Generate a random 4-digit number and combine it with the year
  function generateNumber() {
    return year * 10000 + Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let uniqueNumber;
  do {
    uniqueNumber = generateNumber();
  } while (generatedNumbers.has(uniqueNumber)); // Regenerate if the number is not unique

  // Add the unique number to the set of generated numbers
  generatedNumbers.add(uniqueNumber);

  return uniqueNumber;
}


// Route to insert a new admin
routerComplaint.post('/complaint',protectRoute,  async (req, res) => {
  const { name, email,department,subject,description } = req.body;
  if(!name||!email||!department||!subject||!description){
    return res.status(400).json({error:"All fields are required"})
  }

  const insertQuery = 'INSERT INTO complaints (id, name, email, department,subject,description) VALUES (?, ?, ?, ?,?,?)';
  const id = generateUnique4DigitNumber().toString();
  conn.query(insertQuery, [id, name, email, department,subject,description], (err, result) => {
    if (err) {
      console.error('Error creating complaint:', err.stack);
      res.status(500).json({error:'Error creating complaint'});
      return;
    }
    console.log('Complaint inserted successfully:', result);
    res.status(201).json({message:'Complaint inserted successfully'});
  });
});





module.exports = routerComplaint;




