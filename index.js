const express = require('express');  // Express web server framework
const path = require('path');      // Node.js path module
const mongoose = require('mongoose'); // Mongoose for MongoDB
const db = require('./config/mongoose');  // Mongoose database connection
const Contact = require('./models/contact'); // Mongoose model
const res = require('express/lib/response');
const app = express();           // Create a new Express application
const port = 3000;             // Set the server port


app.use(express.urlencoded({}));  // parser midleware to parse the body of the request
app.use(express.static('assets'));  // serve static files from the assets folder
app.set('view engine', 'ejs'); //setting template engine
app.set('views', path.join(__dirname, 'views')); //setting views folder
app.use(express.json()); // for parsing application/json

var ContactList = [ //creating a contact list 
    { name: 'Jatin', phone: '123-456-7890', email: 'jatin@email.com' },       //object
    { name: 'Gaurav', phone: '234-567-8901', email: 'gaurav@email.com'  },   //object
    { name: 'Anirudh', phone: '345-678-9012', email: 'anirudh@email.com'  },//object
    { name: 'Deepak', phone: '456-789-0123', email: 'deepak@email.com'  }, //object
];

app.get('/', function(req, res){  //get request to the root path

    Contact.find({}, function(err, contacts){ //find all contacts in the database
        if(err){  //if error
            console.log('Error in fetching contacts from db');  //log error
            return;
        }
    
    
return res.render('home', { //rendering home.ejs
    title: "ContactList",
    contacts: contacts //passing contact list to home.ejs 
        });
    });   
});
app.get('/delete-contact/', function(req, res){  //get request to the delete-contact path
    let id = req.query.id; //get the id from the query string
    Contact.findByIdAndDelete(id, function(err){ //find the contact by id and delete it
        if(err){  //if error
            console.log('Error in deleting contact');  //log error
            return;
        }
    return res.redirect('back'); //redirecting to the root path
    });
});
app.post('/contact', function(req, res){  //posting contact controller
    // ContactList.push(req.body); //pushing the contact to the contact list 
    
    const isDuplicate = Contact.duplicateCheck(req.body.phone, req.body.email, function(err, contacts){ //checking for duplicate contacts
        if(err){  //if error
            console.log('Error in duplicate check');  //log error
            return;
        }
        if(contacts){  //if duplicate contact
            console.log('Duplicate contact');  //log error
            return;
        }
    });

    Contact.create({ //creating a new contact object
        name: req.body.name, //getting the name from the body of the request
        phone: req.body.phone, //getting the phone number from the body of the request
        email: req.body.email //getting the email from the body of the request
    }, function(err, newConatact){ //callback function
        if(err){ //if there is an error
            console.log('Error in adding a contact'); //log the error
            return; //return
        }
        console.log('*******', newConatact); //log the new contact
        return res.redirect('/'); //redirecting to home page
    });
       
});
app.post('/getContacts', async function(req, res){  //posting contact controller
    let payload = req.body.payload.trim(); //getting the payload from the body of the request
    let search = await Contact.find({ //finding the contact by name
        name: {
            $regex: new RegExp('^'+payload+'.*','i')}}).exec(); //searching for the payload
            search = search.slice(0,10); //slicing the search results to 10
            res.send({payload: search}); //sending the search results
        });
    

app.listen(port, function(err) {  //listening to port 3000 
    if(err) {  //if error
        console.log(`Error: ${err}`)  //log the error     
    }
    console.log(`Server is listening on port ${port}`)  //log the port
});