const express = require("express");
const router = express.Router({mergeParams:true}); 
const Review = require("../models/models.review");
const Listing = require("../models/models.listing")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware/auth.middleware.js")


// validate middleware for reviews
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
}


// post  review route
// router.post("/",validateReview,wrapAsync(async(req,res)=>{
//     await Review.deleteMany({});
//     let {id} = req.params
//     const listing = await Listing.findById(id);
    
//     if(!listing){
//         throw new ExpressError(400,"Listing is required");
//     }
//     const review = new Review(req.body.review);
//     listing.reviews.push(review);
//     console.log(req.user);
    
//     review.reviewedBy = req.user.username,
//    await listing.save();
//    await review.save();
   
   
//    console.log("review is created");
//    req.flash("success", "Review is created successfully!");
//    res.redirect(`/listings/${listing._id}`);
// }));

router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync(async (req, res) => {
    console.log(req.user);
    const { id } = req.params;

    // Fetch the listing by ID
    const listing = await Listing.findById(id);
    
    

    // Ensure user is authenticated
    if (!req.user || !req.user.username) {
        throw new ExpressError(401, "User not authenticated");
    }

    // Validate review data
    if (!req.body.review) {
        throw new ExpressError(400, "Review data is required",req.body);
    }

    // Create and associate review
    const review = new Review(req.body.review);
    review.reviewedBy = req.user.username;
    listing.reviews.push(review);

    await review.save();
    await listing.save();

    // console.log("Review is created\n",req.body);
    console.log("Review is created\n",req.user);
    console.log("Review is created\n",req.user.username);
    console.log("end");
    
    req.flash("success", "Review is created successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

router.post("/",(req,res)=>{
    let {id} = req.params;
    res.redirect(`/listings/${id}`);
});

// delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted successfully!");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;