const express = require("express");
const router = express.Router(); 
const User = require("../models/models.user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});
router.post("/signup",wrapAsync(async(req,res)=>{
   try {
     const {username,email,password} = req.body;
 
     const newUser =  new User({username,email});
     const regiaterUser = await User.register(newUser,password);
     console.log(regiaterUser);
     req.login(regiaterUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you have register successfully");
        res.redirect("./listings");
     })
    
   }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
   }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{ 
        failureRedirect: '/login' ,
        failureFlash:true
    }),
    (req,res)=>{ 
    req.flash("success","Welcome Back to Wandro!");
    let redirectUrl = res.locals.redirectUrl || "./listings";
    res.redirect(redirectUrl);
});
   
    
router.get("/logout",(req,res,next)=>{

    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("./listings");
    });
})


module.exports = router;