const mongoose = require('mongoose');  // Mongoose for MongoDB

mongoose.connect('mongodb://localhost:27017/contactlist', { 
    useNewUrlParser: true,
    useUnifiedTopology: true

}); // Connect to MongoDB

const db = mongoose.connection; // Mongoose database connection

db.on('error', console.error.bind(console, 'connection error:')); // Error handling

db.once('open', function() { // Once connected to MongoDB
    console.log('Connected to MongoDB'); // Log the connection
});