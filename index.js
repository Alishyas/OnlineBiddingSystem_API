const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const config = require('./config/config');
const bodyParser = require('body-parser');
const helmet = require('helmet')           // adds protection against known web vulnerabilities
const compression = require('compression')  // compresses request body for performance boost
const expressValidator = require('express-validator');

app.use(bodyParser.json());

//app.use(helmet())

app.use(compression());

// validation

app.use(expressValidator());

// allow cross origin

app.use((req , res , next) => {

    res.header("Access-Control-Allow-Origin" , "*");
    res.header(
        "Access-Control-Allow-Headers" ,
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();

});



if (config.env === "production") {

    app.use(morgan('combined'));



} else {

    app.use(morgan('dev'));


}


//dynamic routing so no need to include routes explicitly

fs.readdir('./routes' , (err , files) => {

    files.forEach(file => {

        app.use('/' , require('./routes/' + file))


    });

})



const port = process.env.PORT || config.port;

app.listen(port , () => {

    console.log(`Magic happens at port number ${port}`);


});


module.exports = app;
