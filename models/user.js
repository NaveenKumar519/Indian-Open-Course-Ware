var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    prof : String,
    university : String,
    username : String,
    password : String,
    isTeacher :  {
		type: Boolean,
		default: false
	}
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);