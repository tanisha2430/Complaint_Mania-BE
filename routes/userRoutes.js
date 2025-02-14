const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const routerUser = express.Router();
const conn = require('../src/database/conn.js');
const { adminRoute } = require('../middleware/protectedRoutes.js');



// Define the route to get all users
routerUser.get('/users',adminRoute, (req, res) => {
  const query = 'SELECT name,email FROM users';
  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.stack);
      res.status(500).json({error:'Error fetching users'});
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



// Route to insert a new user
routerUser.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcryptjs.hash(password, 10);

  const insertQuery = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
  const id = generateUnique4DigitNumber().toString();



  try {

    // ponder here
    // const checkUserQuery='SELECT email from '

    const result = await new Promise((resolve, reject) => {
      conn.query(insertQuery, [id, name, email, hashedPassword], (err, result) => {
        if (err) {
          reject(err);
          return res.status(400).json({error:"error"})
        }
        resolve(result);
      });
    });


    // jwtwebtoken
    const data = {
      user: { "id":id }
    }
    const client = await jwt.sign(data, "tanisha");

    console.log('User inserted successfully:', result);
    res.status(200).json({message:"SignUp successful",client})
  } catch (err) {
    console.error('Error inserting user:', err.stack);
    res.status(500).json({error:'Error inserting user'});
  }
});













// User login route
routerUser.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  conn.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err.stack);
      res.status(500).json({error:'Error fetching user'});
      return;
    }

    if (results.length === 0) {
      res.status(401).json({error:'Invalid email or password'});
      return;
    }

    const user = results[0];
    // console.log(user.id);

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({error:'Invalid email or password'});
      return;
    }

    // jwtwebtoken
    const data = {
      user: { "id":user.id }
    }
    const client = await jwt.sign(data, "tanisha");


    res.status(200).json({message:'Login successful',client});
  });
});



module.exports = routerUser;
