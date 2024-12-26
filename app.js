const express = require("express");
const dbConnect = require("./config/dbconnection")
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/models.user.js");
const LocalStrategy = require("passport-local");
// const  Listing = require("../models/models.listing");
const initDB = require("./init/index.js");

dbConnect();
const PORT = process.env.PORT || 5000
// initDB();


// middleware
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// Set the static file directory
app.use(express.static(path.join(__dirname, 'public')));




const sessionOptions = {
    secret : "mysupersecretcode",
    resave :false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    
    next();
})



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRoutes);




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode = 500 , message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listing/error.ejs",{err});
});

app.listen(PORT,(req,res)=>{
    console.log(`server is listening on port ${PORT}`);
});