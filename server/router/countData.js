const router = require("express").Router();
const volunteerData = require("../models/volunteerRegistration");
const clothDonation = require("../models/clothDonation");

router.get("/",async (req, res)=>{
    
    try{
        const volunteers = await volunteerData.countDocuments({});
        const clothDonations = await clothDonation.countDocuments({});
        const donations = clothDonations;
        const distributions = 0;
        res.status(200).json({volunteers, donations, distributions})
    }catch(error){
        res.status(400).send("server-router/countData: something went wrong ")
    }

});

module.exports = router;