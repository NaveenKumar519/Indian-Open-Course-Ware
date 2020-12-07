require("dotenv/config");
const express               = require("express"),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      User                  = require("./models/User"),
      passport              = require("passport"),
	  LocalStrategy         = require("passport-local"),
	  Subject               = require("./models/subject"),
	  Chapter               = require("./models/chapter")
	  passportLocalMongoose = require("passport-local-mongoose"),
      app                   = express();
      
//requiring routes
var assignmentRoutes = require("./routes/assignments"),
    testRoutes       = require("./routes/tests");
//APP CONFIGURATION
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/database_v1",{ useNewUrlParser: true,useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.use(require("express-session")({
    secret: "Never participate in a hackathon when all the team members aren't free",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});


app.use(assignmentRoutes);
app.use(testRoutes);
app.get("/",function(req,res){
	res.render("home");
});
app.post("/",function(req,res){
	console.log(req.body);
	res.render("home");
});
// Chapter.create({chapterName :"Stack and Queue",assignments:[],tests :[]},function(err,newSubject){
//     if(!err){
//         console.log(newSubject)
//     }
// })

// Auth Routes
//Show sign up form
app.get("/register",function(req,res){
	res.render("register");
});
//handling user signup
app.post("/register",function(req,res){
	// console.log(req.body.username);
    // console.log(req.body.password);
    var newUser= new User({
        prof : req.body.prof,
        university : req.body.university,
        username: req.body.username
    })
    if(req.body.typeOfUser === "teacher"){
        newUser.isTeacher = true;
    }
    
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log("OOPS SOMETHING WENT WRONG!!");
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){ //to log in the user
			res.redirect("/dashboard");
		});
	});
});
// LOGIN ROUTES
// render login forms
app.get("/login",function(req,res){
	res.render("login");
});
//login logic
//middleware: code that runs before our final route callback
app.post("/login",passport.authenticate("local",{  //to check our login credentials
	successRedirect: "/dashboard",
	failureRedirect: "/login"
}),function(req,res){ 
    console.log(req.body.username)
    console.log(req.user);
    user = req.body.username;
});
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
//dashboard
app.get("/dashboard",isLoggedIn,function(req,res){
    res.render("dashboard");
   
})
// writing our own middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	 res.redirect("/login");		
}
app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("The server is listening!!!");
});