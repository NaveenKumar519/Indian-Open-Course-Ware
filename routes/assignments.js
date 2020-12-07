var express = require("express");
var router = express.Router();
var Chapter    = require("../models/chapter"),
    Subject    = require("../models/subject"),
    multer     = require("multer"),
    path       = require("path"),
    fs         = require("fs"),
    imgModel   = require("../models/image");
//multer for uploading assignments
var storage = multer.diskStorage({
    destination : "./public/uploads",
    filename : function(req,file,cb){
       cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({
    storage : storage
})
//Route to view all the uploaded assignments
router.get("/assignment/show",function(req,res){
   
    Subject.find({}).populate('chapters').exec(function(err,totalSubjects){
        if(err){
            console.log(err);
        }
        else{
            res.render("show.ejs",{subjects : totalSubjects});
        }
    })
    
})
router.post("/assignment/show",function(req,res){
    // console.log(req.body);
    // console.log(req.body.chapter);
    Subject.findOne({subjectName : req.body.subject}).populate('chapters').exec(function(err,foundSubject){
        if(err){
            console.log(err);

        }
        else{
            // console.log(foundSubject);
            Chapter.findOne({chapterName : req.body.chapter}).populate('assignments tests').exec(function(err,foundChapter){
                if(err){
                    console.log(err);
                }
                else{
                    // console.log(foundChapter)
                    res.render("searchAsst",{chapter : foundChapter});
                }
            })
        }
        
    })
  
})
//Route to upload an assignment
router.get("/assignment/new",function(req,res){
    // console.log("route is working")
    Subject.find({}).populate('chapters').exec(function(err,totalSubjects){
        if(err){
            console.log(err);
        }
        else{
            console.log(totalSubjects);
            res.render("upload.ejs",{subjects : totalSubjects});
        }
    })
});
// assignment/new
router.post("/assignment",upload.single('image'),function(req,res,next){
//    console.log(req.body);
   var obj = {
       prof : req.user.prof,
       university : req.user.university,
       img:{
           data : fs.readFileSync("./public/uploads/"+req.file.filename),
           contentType : 'Asst[file].jpg'
       }
    }
    Subject.findOne({subjectName : req.body.subject}).populate('chapters').exec(function(err,foundSubject){
        if(err){
            console.log(err);
        }
        else{
            Chapter.findOne({chapterName : req.body.chapter}).populate('assignments tests').exec(function(err,foundChapter){
                if(err){
                    console.log(err);
                }
                else{
                    imgModel.create(obj,function(err,item){
                        if(err){
                            console.log(err);
                        }
                        else{
                            foundChapter.assignments.push(item);
                            foundChapter.save();
                            foundSubject.chapters.push(foundChapter);
                            foundSubject.save();
                            // console.log(foundSubject);
                            // console.log(foundChapter);
                            // console.log(item);
                            res.render("showAsst.ejs",{image:item});
                        }
                    })
                }
            })
        }
        
    })
  
});
module.exports = router;