// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app=express();
const PORT = process.env.PORT || 4000;

//database connection
// mongoose.connect(process.env.DB_URI, { 
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//       });
//   const db = mongoose.connection;
//   db.on("error", (error) => console.log(error));
//   db.once("open", () => console.log("Connected to the database"));

//const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://jp0836142:WqHiY4m5ALgr2hMU@cluster0.im6dwrb.mongodb.net'; // Ensure the database name is valid
mongoose.connect(dbURI, {});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req,res,next) => {
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
});

//for image
app.use(express.static("uploads"));

// set template engine
app.set("view engine","ejs");

//route prefix
app.use("",require("./routes/routes"));

app.listen(PORT,() =>{
    console.log(`Server started at http://localhost:${PORT}`)
});