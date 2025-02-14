const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const routerAdmin = express.Router();
const conn = require('../src/database/conn.js');
const { adminRoute } = require('../middleware/protectedRoutes.js');

// Utility function to send error responses
const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};

// Route to insert a new admin
routerAdmin.post('/admin', async (req, res) => {
  const { name, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcryptjs.hash(password, 10);

  const insertQuery = 'INSERT INTO admin (id, name, email, password) VALUES (?, ?, ?, ?)';
  const id = generateUnique4DigitNumber().toString();

  try {
    const result = await new Promise((resolve, reject) => {
      conn.query(insertQuery, [id, name, email, hashedPassword], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });


    // jwtwebtoken
    const data = {
      admin: { "id":id }
    }
    const manager = await jwt.sign(data, "tanisha");

    console.log('User inserted successfully:', result);
    res.status(200).json({message:"SignUp successful",manager})
  } catch (err) {
    console.error('Error inserting admin:', err.stack);
    res.status(500).json({error:'Admin already exists'});
  }
});

//const manager=jwt.sign({id},"tanisha")



// Admin login route
routerAdmin.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM admin WHERE email = ?';
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
    console.log(user);

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({error:'Invalid email or password'});
      return;
    }

    // jwtwebtoken
    const data = {
      admin: { "id":user.id }
    }
    const manager = await jwt.sign(data, "tanisha");


    res.status(200).json({message:'Login successful',manager});
  });
});

// Function to generate unique 4-digit number
function generateUnique4DigitNumber() {
  const year = 2024;
  const min = 1000;
  const max = 9999;
  const generatedNumbers = new Set();

  function generateNumber() {
    return year * 10000 + Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let uniqueNumber;
  do {
    uniqueNumber = generateNumber();
  } while (generatedNumbers.has(uniqueNumber));

  generatedNumbers.add(uniqueNumber);
  return uniqueNumber;
}

module.exports = routerAdmin;
