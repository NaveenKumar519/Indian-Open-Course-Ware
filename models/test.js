var mongoose = require("mongoose");
//MODEL CONFIG
const testSchema=new mongoose.Schema({
    prof : String,
    university : String,
    questionsImg : {
            data:Buffer,
            contentType:String
   },           
    answers : []
 });

//Compiling into a model
module.exports = mongoose.model("Test",testSchema);