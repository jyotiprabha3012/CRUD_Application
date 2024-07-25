const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');

//image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads');

    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" +file.originalname);
    },
        
    
});

var upload = multer({
    storage: storage,
}).single("image");


router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename, 
        });
        console.log(req.file.filename);
        await user.save();
        req.session.message = {
            type: "success",
            message: "User added successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

//Get all users route
// router.get("/",(req,res) => {
//     User.find().exec((err, users) => {
//         if(err){
//             res.json({ message: err.message });
//         }else{
//             res.render('index', {
//                 title: 'Home Page',
//                 users: users,
//             });

//         }
//     });
// });
router.get("/", async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});
// adjust the path to your actual model

// Refactored code with async/await
// router.get("/", async (req, res) => {
//     const id = req.params.id;
//     try {
//         const doc = await User.findById(id);
//         if (!doc) {
//             console.log(doc);
//             res.status(404).send('Document not found');
//         } else {
//             res.status(200).send(doc);
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

//module.exports = router;
router.get("/add",(req, res) => {
    res.render("add_users", { title: "Add Users" });
});
//about section


//Edit ann user route
// router.get("/edit/:id", (req,res) => {
//     let id = req.params.id;
//     User.findById(id, (err, user) => {
//         if(err) {
//             res.redirect("/");
//         }else{
//             if(user == null){
//                 res.redirect("/");
//             }else{
//                 res.render("edit_users", {
//                     title: "Edit User",
//                     user: user,
//                 });
//             }
//         }
//     });
// });

// router.get('/edit/:id', async (req, res) => {
//     try {
//         const result = await Model.findById(req.params.id);
//         res.json(result);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            if (user == null) {
                res.redirect("/");
            } else {
                res.render("edit_users", {
                    title: "Edit User",
                    user: user,
                });
            }
        })
        .catch(err => {
            res.redirect("/");
        });
});













//update user route
// router.post('/update/:id', upload, (req,res) => {
//     let id=req.params.id;
//     let new_image = "";

//     if(req.file){
//         new_image = req.file.filename;
//         try{
//             fs.unlinkSync('./uploads/'+req.body.old_image);
//         } catch(err){
//             console.log(err);
//         }

//     }else{
//         new_image = req.body.old_image;
//     }

//     User.findByIdAndUpdate(id, {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image: new_image,
//     }, (err, result) => {
//         if(err){
//             res.json({ message: err.message, type: "danger"});
//         }else{
//             req.session.message = {
//                 type: "success",
//                 message: "User updated successfully!",
//             };
//             res.redirect("/");
//         }
//     })
// });

// const fs = require('fs').promises; // Use fs.promises for async file operations
// const multer = require('multer');
const uploa = multer({ dest: 'uploads/' }); // Configure your multer upload destination

router.post('/update/:id', uploa.single('image'), async (req, res) => {
    const id = req.params.id;
    let new_image = "";

    if (req.file) {
        new_image = req.file.filename;
        try {
            await fs.unlink('./uploads/' + req.body.old_image); // Await the unlink operation
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    const updateData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    };

    try {
        const result = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!result) {
            res.status(404).json({ message: 'User not found', type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "User updated successfully!",
            };
            res.redirect("/");
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

//Delete user route
// router.get("/delete/:id", (req,res) => {
//     let id = req.params.id;
//     User.findByIdAndDelete(id, (err, result) =>{
//         if(result.image != ""){
//             try{
//                 fs.unlinkSync("./uploads/" + result.image);
//             }catch(err){
//                 console.log(err);
//             }
//         }
//     if(err){
//         res.json({ message: err.message});
//     }else{
//         req.session.message = {
//             type: "info",
//             message: "User deleted successfully",
//         };
//         res.redirect("/");
//     }

//     });
// });


router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
  
    User.findByIdAndDelete(id)
      .then(result => {
        if (result.image != "") {
          try {
            fs.unlinkSync("./uploads/" + result.image);
          } catch (err) {
            console.log(err);
          }
        }
  
        req.session.message = {
          type: "info",
          message: "User deleted successfully",
        };
        res.redirect("/");
      })
      .catch(err => {
        res.json({ message: err.message });
      });
  });

module.exports = router;