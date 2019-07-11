const mongoose = require('mongoose') ,
    User = require('../models/user') ,
    Product = require('../models/products');
const uuidv1 = require('uuid/v1');

const connStr = 'mongodb://localhost/Auction';
mongoose.connect(connStr , function (err) {

    if (err) throw err;
    console.log('Successfully connected to MongoDB');

});



module.exports={

    signup: (req , res) => {

        req.checkBody('username').notEmpty().withMessage('Username is empty').isLength({min: 5 , max: 12})
            .withMessage('Username must be between 5 to 12 characters').isAlphanumeric().withMessage('Username number must be alphanumeric only');

        req.checkBody('password').notEmpty().withMessage('Password is empty').isLength({min: 8 , max: 12})
            .withMessage('Password must be between 8 to 20 characters');
        const error = req.validationErrors();
        if (error) {

            const response = [];
            error.forEach(function (err) {

                response.push(err.msg);

            });

            return res.status(422).send({msg:'There were some validation errors' , errors: response});

        }



        const testUser = new User({
            username: req.body.username ,
            password: req.body.password ,
            type: req.body.type
        });

        testUser.save(function (err) {

            if (err)  return res.status(401).send({msg:'There was some error' , errors: err.errmsg});

            res.status(200).send({msg:'Successfully registered' , errors: null});
           
        });
    
    } ,
    login: (req , res) => {
        
        console.log(req.body)

        req.checkBody('username').notEmpty().withMessage('Username is empty');
        req.checkBody('password').notEmpty().withMessage('Password is empty');
        const error = req.validationErrors();
        if (error) {

            const response = [];
            error.forEach(function (err) {

                response.push(err.msg);

            });

            return res.status(422).send({msg:'There were some validation errors' , errors: response});

        }



        User.findOne({ username: req.body.username } , function (err , user) {


            if (!user)  {

                return res.status(401).send({msg:'There was some error' , errors: 'User not found'});
            
            }

            // test a matching password

            user.comparePassword(req.body.password , function (err , isMatch) {


                if (!isMatch)  return res.status(401).send({msg:'There was some error' , errors: "Passsword doesn't match"});
                res.status(200).send({msg:'Successfully logged in' , errors:null, data:user});


            });

        })

    } ,
    create: (req , res) => {

        req.checkBody('name').notEmpty().withMessage('Name is empty').isLength({ min: 3 , max: 20 })
            .withMessage('Name must be between 3 to 20 characters').isAlphanumeric().withMessage('Name number must be alphanumeric only');


        const error = req.validationErrors();
        if (error) {

            const response = [];
            error.forEach(function (err) {

                response.push(err.msg);

            });

            return res.status(422).send({ msg: 'There were some validation errors' , errors: response });

        }



        const testProduct = new Product({
            name: req.body.name ,
            image: req.body.image ,
            description: req.body.description ,
            date: new Date() ,
            uuid: uuidv1()
        });

        testProduct.save(function (err) {

            if (err) return res.status(401).send({ msg: 'There was some error' , errors: err.errmsg });

            res.status(200).send({ msg: 'Successfully registered product' , errors: null });

        });

    } ,

    deleteProduct: (req , res) => {

        if(!req.body.uuid){

            return res.status(401).send({ msg: 'There was some error' , errors: "Uuid Missing" });

        }

        Product.deleteOne({ uuid: req.body.uuid } , function (err) {

            if (err) return res.status(401).send({ msg: 'There was some error' , errors: err.errmsg });

         
            res.status(200).send({ msg: 'Successfully deleted product' , errors: null });

        });
    
    } ,
    findProduct: (req , res) => {

        console.log(req.body)

        if (!req.body.uuid) {

            return res.status(401).send({ msg: 'There was some error' , errors: "Uuid Missing" });

        }

        Product.findOne({ uuid: req.body.uuid } , function (err , data) {


            if (err) return res.status(401).send({ msg: 'There was some error' , errors: err.errmsg });

            res.status(200).send({ msg: 'Success' , errors: null , data: data });

        });

    } ,

    updateProduct: (req , res) => {

        Product.updateOne({ uuid: req.body.uuid } , {name: req.body.name , description: req.body.description , image: req.body.image} , function (err , data) {

            if (err) return res.status(401).send({ msg: 'There was some error' , errors: err.errmsg });

            res.status(200).send({ msg: 'Success' , errors: null , data: data });

        });
        

    } ,
    getAllProducts: (req , res) => {

        Product.find({} , function (err , data) {

            if (err) {

                console.log(err);
                if (err) return res.status(401).send({ msg: 'There was some error' , errors: err.errmsg });

            } else {

                res.status(200).send({ msg: 'Success' , errors: null , data: data });
            
            }
        
        })


    } ,



}