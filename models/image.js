var mongoose = require("mongoose");
//MODEL CONFIG
const imgSchema=new mongoose.Schema({
    prof : String,
    university : String,
    img : {
        data:Buffer,
        contentType:String
    }
 });

//Compiling into a model
module.exports = mongoose.model("imgModel",imgSchema);