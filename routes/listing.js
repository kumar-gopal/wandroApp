const express = require("express");
const router = express.Router(); 
const Listing = require("../models/models.listing");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const { upload } = require("../middleware/multer.middleware.js");
const {
    getAllUser,
    creatNewListing,
    updateListing,
    editListing,
    deleteListing,
    getListingwithId
} = require("../controllers/listing.controllers.js");



// validate middle for listing
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
}


// show all Listings

router.get("/", getAllUser);




// create Listing
router.get("/new",
    isLoggedIn,
    (req,res)=>{
    res.render("./listing/new.ejs");
});




// 
router.post(
    "/",
    upload.single("listing[image]"), // Handle single file upload from the "listing[image]" field
    validateListing, 
    wrapAsync(creatNewListing)
);



// edit
router.get("/:id/edit",
    isLoggedIn,editListing);

// update

router.put("/:id",upload.single("listing[image]"),validateListing, updateListing);

// delete listing
router.delete("/:id", 
    isLoggedIn,deleteListing);

router.get("/:id",getListingwithId);


module.exports = router;