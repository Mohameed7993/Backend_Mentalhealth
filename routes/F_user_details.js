var express = require('express');
var router = express.Router(); // הוא מקבל את הבורט מהפייל שקרא לו  ומנתב אותה 


const upload =require('../middleware/upload');
const upload1=require ('../middleware/upload1')


var Customer = require("../models/userdetails");
var Cus_MentalHealth=require("../models/userInform");
var SocialBroadCast=require("../models/socaillinks");
const PdfModel = require('../models/pdfModel');
const VideoModel=require('../models/videoModel')

// //Methods
// // post:creating new user in DB
// // get: reading from DB
// // put: update user by id in DB
// // delete: delete user by id in DB


router.post('/addmoreinform',async (req,res)=>{
  var customerInformationID=req.body.UserId;
  var customerInformation=req.body.data;

  var newcustomerInformation =new Cus_MentalHealth({
    id:customerInformationID,
    mental_state:customerInformation.mentalState,
    anxiety:customerInformation.anxietyLevel,
    summary:((customerInformation.mentalState >5)&&(customerInformation.anxietyLevel>5)?"Maintaining a balanced mental state with moderate anxiety."
    :((customerInformation.mentalState <=5)&&(customerInformation.anxietyLevel<=5)?"Averagely stable mental state with moderate anxiety levels."
    : (customerInformation.mentalState >=5)&&(customerInformation.anxietyLevel<=5)?"Excelling in mental well-being with low levels of anxiety." 
    : (customerInformation.mentalState <=5)&&(customerInformation.anxietyLevel>=5)?"Facing challenges with both mental well-being and high anxiety."
    :"other"))
  })

  // Save the new customerInformation to the database
  newcustomerInformation.save().then((savedCus_MentalHealth) => 
  {
      res.json({message:"New user added",type:"success"});
  })
  .catch((err) => {
      res.json({ message: "Database error", type: "error" });
  });

})



//request for signup
router.post('/signup', function (req, res) {
    var customerDetails = req.body;

    // Check if password and confirm password match
    if (customerDetails.password !== customerDetails.confirmpassword) {
        return res.json({message:"Passwords do not match",type:"error"} );
    }

    // Check if the username is already taken
    Customer.findOne({ username: customerDetails.username })
    .then(existingUser => {
        if (existingUser) {
            // Username already exists in the database
            return res.json({message:"Username already taken",type:"error"});
        }

        // If username is not taken and passwords match, proceed to create the new customer
        var newCustomer = new Customer({
            fullname: customerDetails.fullname,
            username: customerDetails.username,
            email: customerDetails.email,
            phonenumber: customerDetails.phonenumber,
            password: customerDetails.password,
            role: 1,
            age: customerDetails.age,
            location: customerDetails.location,
            status: "Inactive",// 0=pending, 1=active
            isfirsttimelogin:true
        });

        // Save the new customer to the database
        newCustomer.save()
        .then((savedCustomer) => {
            res.json({message:"New user added",type:"success"});
        })
        .catch((err) => {
            res.json({ message: "Database error", type: "error" });
        });
    });
});


//request for checking login!
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user details based on the provided username
    const user = await Customer.findOne({ username });

    if (!user) {
      return res.json({message:'User not found',type: 'error'});
    }

   
    // Check if the provided password matches the stored password
    

    {
    if ((user.password) === (password)) {
      if(user.status==='Inactive'){
        res.json({message:'your account is Inactive, Plese wait for activating!',type: 'error'});
      }else{
      const Role=user.role;
      res.json({message:'Login successful',Role,user,type:'success'});}
    } else {
      res.json({message:'Incorrect password',type: 'error'});
    }
  }
 } catch (error) {
    console.error('Error:', error);
    res.json({ message: 'Internal server error', type: 'error' });
  }
});



///for updaing user details!
router.patch('/profile', async (req, res) => {
    try {
    
      const userid=req.body.UserId;
      const newDetails=req.body.inputs;

      // Assuming `newDetails` is an object with fields you want to update.
      // For example: { email: "newemail@example.com", username: "newusername" }
      const updatedUser = await Customer.findByIdAndUpdate(
        userid,
        { $set: newDetails },
        { new: true } // Returns the updated document when set to true
      );
  
      if (!updatedUser) {
        return res.json({message:'User Not found',type:'error'});
      }
      else{
        res.json({message:'update successful',type:'success'});
      }
  
     // res.json(updatedUser);
    } catch (error) {
      res.json({message:'An error occurred while updating the profile',type:'error'});
    }
  });

  router.patch('/editsociallink', async (req, res) => {
    try {
      const newlink = req.body;
        console.log(req.body)
    //find the id to use findbyidandupdate!
      const idForLink = await SocialBroadCast.findOne({ socialtype: newlink.socialtochange });
      if (!idForLink) {
        return res.json({ message: 'Link not found', type: 'error' });
      }
      
  
      // Use the found ID to update the document
      const updateLinksBroadcasts = await SocialBroadCast.findByIdAndUpdate(
        idForLink._id, 
        { $set: { socialtype: newlink.socialtochange, url: newlink.url } },
        { new: true } 
      );
  
      if (!updateLinksBroadcasts) {
        return res.json({ message: 'Failed to update the link', type: 'error' });
      } else {
       
        res.json({ message: 'Link updated successfully', type: 'success' });
      }
  
    } catch (error) {
      console.error('An error occurred while updating social links:', error);
      res.json({ message: 'An error occurred while updating social links', type: 'error' });
    }
  });
  

router.delete('/deleteuser', async (req, res)=>{
  try {
    const Id=req.body.User_Id;
    const User= await Customer.findOneAndDelete({_id:Id})
    if (!User) {
      return res.json({message:'User not found',type:'error'}); // if no user was deleted
    }
    res.json({message:"user deleted successfully",type:'success' })
  } catch (error) {
    console.error({ message:'server Error',error:error.message });
  }
});

router.delete('/deletearticles', async (req, res)=>{
  try {
    const filename=req.body.filename;
    console.log(filename)
    const articlefile= await PdfModel.findOneAndDelete({filename:filename})
    if (!articlefile) {
      return res.json({message:'Articl file not found',type:'error'}); // if no user was deleted
    }
    res.json({message:"Articl deleted successfully",type:'success' })
  } catch (error) {
    console.error({ message:'server Error',error:error.message });
  }
});

router.delete('/deleteVideo', async (req, res)=>{
  try {
    const videoId=req.body.videoId;
    const video= await VideoModel.findOneAndDelete({_id:videoId})
    if (!video) {
      return res.json({message:'video  not found',type:'error'}); // if no user was deleted
    }
    res.json({message:"video deleted successfully",type:'success' })
  } catch (error) {
    console.error({ message:'server Error',error:error.message });
  }
});





router.get('/getsociallinks',async(req,res)=>{
try {
  console.log(1);
  const links= await SocialBroadCast.find({});
  console.log(links);
  res.json(links);
} catch (error) {
  console.error("Error Getting links:", error);
  res.json({ message: "Failed to fetch the socail links" ,type:'error'});
}
});



  router.get('/users', async (req, res) => {
    try {
        const users= await Customer.find({});
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.json({ message: "Failed to fetch users" ,type:'error'});
    }
  });

  router.get('/getmentalinformation',async (req,res)=>{
    try {
     const mentalInform =await Cus_MentalHealth.find({});
      res.json(mentalInform);
    } catch (error) {
      console.error("Error gitting infromation:", error);
      res.json({ message: "Failed " ,type:'error'});
    }
  });

 
  router.get('/files', async (req, res) => {
    try {
      const files = await PdfModel.find().select('-buffer -contentType'); // Fetch files from MongoDB
      res.json(files)
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Error fetching files." });
    }
  });

  router.get('/videos',async(req,res)=>{
    try {
      const videodetails= await VideoModel.find().select('-Data -contentType');
      res.json(videodetails);
    } catch (error) {
      console.error("Error fetchin videos: ",error)
      res.status(500).json({message: "Error fetching files." });
    }
  })


  router.get('/videos/:videoId', async(req, res )=> {
    try{
      const video = await VideoModel.findById(req.params.videoId).select('Data contentType filename')
      const videoData = video.Data
      res.setHeader('Content-Type', video.contentType)
      return res.send(videoData)
    }catch(error){
      res.send(error)
    }
  })



  router.get('/files/:fileId', async(req, res )=> {
    try{
      const file = await PdfModel.findById(req.params.fileId).select('buffer contentType filename')
      const fileData = file.buffer
      res.setHeader('Content-Type', file.contentType)
      // res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`)
      return res.send(fileData)
    }catch(error){
      res.send(error)

    }
  })


  router.post('/uploadnewvideo',upload1,async (req, res) => {
    console.log(req.formData);

    try{
      //checking if the file is giiting from the front side 
      if (!req.file) {
        console.log(req.file)
        return res.status(400).json({ message: "Please upload a file." });
    }
    const data = req.file.buffer;
    // Creating new documents for video in db
    const newVideo = new VideoModel({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        Data: data, // save the content of file ass buffer
        exerciseName: req.body.exerciseName, 
        how_to_do:req.body.how_to_do,
        description: req.body.description,
        level: req.body.level 
    }); 
    // saveing the newVideo document to MongoDB
   await newVideo.save();
   res.json({ message: "Video uploaded successfully.",type:"success" });
  }
  
  catch (error) {
    console.error("Error uploading video:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    res.json({ message: errorMessage, type: "error" });
  }
  });


  

  router.post('/uploadnewfile', upload, async (req, res) => {

    try {
        //checking if the file is giiting from the front side 
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file." });
        }
        const data = req.file.buffer;
        //creating new doucments for in db
        const newPdf = new PdfModel({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            buffer: data, // Save file buffer
            documentName: req.body.documentName,
            description: req.body.description,
            level: req.body.level
        });

        //save the new creatin doucments
        await newPdf.save();

        res.json({ message: "File uploaded successfully." });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.json({ message: "Error uploading file." });
    }
});
  

module.exports = router;

