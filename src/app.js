const express = require('express');
const app = express();
const usersRouter = require('../routes/userRoutes.js'); 
const adminsRouter = require('../routes/adminRoutes.js'); 
const complaintsRouter = require('../routes/complaintRoutes.js');
const cors=require('cors'); 



// Import the script to create tables
require('./module/formUser.js');
require('./module/formAdmin.js');
require('./module/formComplaint.js');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

// Use the users router
app.use('/api', usersRouter); 
app.use('/api', adminsRouter);
app.use('/api', complaintsRouter);

// Start the Express server
const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});