var mongoose = require("mongoose");
const subject = require("../../v2/models/subject");
//MODEL CONFIG
const subSchema=new mongoose.Schema({
    subjectName : String,
    chapters : [
            {
                type : mongoose.Schema.Types.ObjectId,
                 ref : "Chapter"
            }
    ]
 });

//Compiling into a model
module.exports = mongoose.model("Subject",subSchema);