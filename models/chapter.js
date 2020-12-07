var mongoose = require("mongoose");
//MODEL CONFIG
const chapSchema=new mongoose.Schema({
    chapterName : String,
    assignments : [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref : "imgModel"
                }
    ],
    tests : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref : "Test"
            }
    ]
   
 });

//Compiling into a model
module.exports = mongoose.model("Chapter",chapSchema);