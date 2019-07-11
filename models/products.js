const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: {
        type: String ,
        unique: true ,
        required: true
    } ,
    description: {
        type: String ,
        required: true
    } ,
    image: {
        type: String ,
        required: true
    } ,
    date: {
        type: Date ,
        required: true
    } ,
    uuid:{
        type: String ,
        unique: true ,
        required: true
    }
});
module.exports = mongoose.model('Product' , productSchema);