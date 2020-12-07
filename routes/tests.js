var express = require("express");
var router = express.Router();
var Chapter    = require("../models/chapter"),
    Subject    = require("../models/subject"),
    multer     = require("multer"),
    path       = require("path"),
    fs         = require("fs"),
    Test       = require("../models/test");
//multer for uploading tests
var storageForTests = multer.diskStorage({
    destination : "./public/testUploads",
    filename : function(req,file,cb){
       cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var uploadTest = multer({
    storage : storageForTests
})
//route to upload test
router.get("/test/new",function(req,res){
    Subject.find({}).populate('chapters').exec(function(err,totalSubjects){
        if(err){
            console.log(err);
        }
        else{
            // console.log(totalSubjects);
            res.render("uploadTest.ejs",{subjects : totalSubjects});
        }
    })
});
router.post("/test",uploadTest.single('image'),function(req,res,next){
    var array = req.body.array;
    for(var i=0; i<array.length; i++){
        array[i] = array[i].toLowerCase();
    }
     var testObj = {
        prof : req.user.prof,
        university : req.user.university,
        questionsImg : {
            data : fs.readFileSync("./public/testUploads/"+req.file.filename),
            contentType : 'image.jpg'
        },
        answers : array
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
                    Test.create(testObj,function(err,item){
                        if(err){
                            console.log(err);
                        }
                        else{
                            foundChapter.tests.push(item);
                            foundChapter.save();
                            foundSubject.chapters.push(foundChapter);
                            foundSubject.save();
                            res.send("Uploaded successfully")
                        }
                    })
                }
            })
        }
        
    })
})
//route to search the tests
router.get("/test/show",function(req,res){
    Subject.find({}).populate('chapters').exec(function(err,totalSubjects){
        if(err){
            console.log(err);
        }
        else{
            // console.log(totalSubjects);
            res.render("showTest.ejs",{subjects : totalSubjects});
        }
    })
   
})
router.post("/test/show",function(req,res){
//    console.log(req.body);
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
                    res.render("searchTest",{chapter : foundChapter});
                }
            })
        }
        
    })
  
})
//route to attempt a test
router.get("/test/attempt/:id",function(req,res){
    Test.findById(req.params.id,function(err,foundTest){
        if(err){
            console.log(err)
        }
        else{
            res.render("attemptTest",{test : foundTest});
        }
    })
})
router.post("/test/:id",function(req,res){
    var responses = req.body.responses;
    for(var i=0; i<responses.length; i++){
        responses[i] = responses[i].toLowerCase();
    }
    Test.findById(req.params.id,function(err,foundTest){
        if(err){
            console.log(err)
        }
        else{
            var marks = 0;
            for(var i=0; i<foundTest.answers.length; i++){
                if(responses[i] === foundTest.answers[i]){
                    marks ++;
                }
            }
            res.render("score",{marks: marks,test:foundTest});
        }
    })
});
module.exports = router;