const jwt = require('jsonwebtoken');
const conn = require('../src/database/conn.js'); // Assuming conn is your database connection


// user 
const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("client");
    if (!token) {
      return res.status(401).json({ error: "Please login first as user" });
    }
    const decode = jwt.verify(token, "tanisha");

    console.log(decode);

    if (!decode || !decode.user || !decode.user.id) {
      return res.status(401).json({ error: "Not decoded" });
    }

    const query = 'SELECT name, email FROM users WHERE id = ?';
    conn.query(query, [decode.user.id], async (err, results) => {
      if (err) {
        console.error('Error fetching user:', err.stack);
        res.status(500).json({error:'Error fetching user'});
        return;
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      //  pass the user's name and email to the next middleware
      req.user = {
        name: results[0].name,
        email: results[0].email
      };
      
      next();
    });
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({error:'Error decoding token'});
  }
};



//admin
const adminRoute = async (req, res, next) => {
  try {
    const token = req.header("manager");
    if (!token) {
      return res.status(401).json({ error: "Please login as admin" });
    }
    const decode = jwt.verify(token, "tanisha");

    console.log(decode);
    console.log(decode.admin)
    console.log(decode.admin.id)

    if (!decode || !decode.admin.id) {
      return res.status(401).json({ error: "Not decoded" });
    }

    const query = 'SELECT name, email FROM admin WHERE id = ?';
    conn.query(query, [decode.admin.id], async (err, results) => {
      if (err) {
        console.error('Error fetching admin:', err.stack);
        res.status(500).json({error:'Error fetching admin'});
        return;
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // pass the admin's name and email to the next middleware
      req.admin = {
        name: results[0].name,
        email: results[0].email
      };
      
      next();
    });
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({error:'Error decoding token'});
  }
};

module.exports = { protectRoute, adminRoute };

