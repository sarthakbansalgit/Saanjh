
//Imported packages

const express = require('express');

//For hashing the password to secure it
const bcrypt = require('bcryptjs');

//Imported schema of the user
const User = require("../models/User");
const Otp = require("../models/Opt")
const Admin = require('../models/Admin')
const Message = require('../models/Message')

const fetchuser = require('../middleware/fetchUser')
// nodemail
const nodemailer = require('nodemailer')








var jwt = require('jsonwebtoken'); //JWT included for security


//Express validator
const { body, validationResult } = require('express-validator');


// const fetchuser = require("../midleware/fetchUser");



//***************JSON WEB TOKEN SECRET KEY **************/

const JWT_SECRET = "thisISveryImportant@forSecurity";


// *************** ANTI-CHEAT SECURITY FILTER ***************
// Function to scrub out phone numbers, emails, handles, and prohibited social references.
const antiCheatFilter = (text) => {
    if (!text) return text;

    // 1. Remove Phone Numbers (Any 9 to 13 digit combinations including shapes like +91-9876543210 or 987 654 3210)
    let safeText = text.replace(/(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}|(\d{3}[-\.\s]\d{3}[-\.\s]\d{4})|\d{10}/gi, "[CONTACT BLOCKED]");

    // 2. Remove Email Addresses
    safeText = safeText.replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/gi, "[EMAIL BLOCKED]");

    // 3. Remove Social/Handles (anything starting with @ that looks like a username)
    safeText = safeText.replace(/@([a-zA-Z0-9_]{3,})/gi, "[ID BLOCKED]");

    // 4. Block specific App keywords
    safeText = safeText.replace(/(whatsapp|insta|instagram|snapchat|telegram|fb|facebook)/gi, "[APP HIDDEN]");

    return safeText;
}

//For routing
const router = express.Router();


//FOR image uploading
const multer = require('multer');
const path = require('path');






const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//FOR setting the directory where our images will be stored.....
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Specify the absolute directory where images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Admin Moderation Engine (Block / Approve Profiles)
router.post('/admin/modstatus', async (req, res) => {
    try {
        const { targetId, targetStatus } = req.body; // status: "approved" or "blocked"

        const user = await User.findById(targetId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.status = targetStatus;
        await user.save();

        res.json({ success: true, message: `Profile successfully marked as ${targetStatus}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Status Update Error" });
    }
});



router.post('/uploadimage', fetchuser, upload.single('image'), async (req, res) => {
    try {
        // Update the user's profile with the new formatted image URL string
        const userId = req.user.id;
        const imageUrl = "uploads/" + req.file.filename; // Properly format safe static path
        console.log("Saving new Image:", imageUrl);
        let success = false;

        // Update the Organizer model with the imageUrl
        await User.findByIdAndUpdate(userId, { $set: { image: imageUrl } });
        success = true
        res.json({ success, message: 'Image uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});












//**** For creating user /auth/createUser        ---- No LOGIN REQUIRED  ----- */

router.post('/page1/createuser', [

    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter valid password").isLength({ min: 5 })


],


    async (req, res) => {
        //console.log(req.body);

        //********************** */ For storing data into mongo database without validation
        // const user = User(req.body);
        // user.save();

        let success = false;



        try {


            //*********Express validation */
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                success = false;
                return res.json({ success, error: "Sorry, a user with this email already exists..." });
            }

            let phone = await User.findOne({ phone: req.body.phone });
            console.log(phone)
            if (phone) {
                success = false
                return res.json({ success, error: "Sorry, a user with this mobile number already exists..." });


            }



            //Hashing the password to secure it using bcryptJS
            const salt = await bcrypt.genSaltSync(10);
            const secPassword = await bcrypt.hash(req.body.password, salt);

            // Anti-Cheat filtering for user text fields
            const safeDescription = antiCheatFilter(req.body.description);
            const safePartnerPreference = antiCheatFilter(req.body.partnerPreference || "");
            const safeName = antiCheatFilter(req.body.name);

            user = await User.create({
                name: safeName,
                age: req.body.age,
                email: req.body.email,
                phone: req.body.phone,
                caste: req.body.caste,
                dob: req.body.dob,
                state: req.body.state,
                district: req.body.district,
                height: req.body.height,
                weight: req.body.weight,
                education: req.body.education,
                working: req.body.working,
                password: secPassword,
                description: safeDescription,
                gender: req.body.gender,
                religion: req.body.religion || "Not Specified",
                motherTongue: req.body.motherTongue || "Not Specified",
                maritalStatus: req.body.maritalStatus || "Never Married",
                partnerPreference: safePartnerPreference
            })

            const data = {
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            console.log({ success, authToken });
            res.json({ success, authToken });



            //res.json({success: "User created successfully"});


        }


        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }


        // .then(user => res.json(user))
        // .catch(err=> {console.log(err)
        // res.json({error:"Email is already in use", message:err.message})});

    })



// **************************************************************************************
//ROUTE FOR CREATING AN ORGANIZER










// --------------------------------------------------------------------------------------





router.post('/page1/createadmin', [

    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter valid password").isLength({ min: 5 })


],


    async (req, res) => {
        //console.log(req.body);

        //********************** */ For storing data into mongo database without validation
        // const user = User(req.body);
        // user.save();

        let success = false;



        try {


            //*********Express validation */
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }

            let user = await Admin.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: "Sorry, a user with this email already exists..." });
            }



            //Hashing the password to secure it using bcryptJS
            const salt = await bcrypt.genSaltSync(10);
            const secPassword = await bcrypt.hash(req.body.password, salt);


            user = await Admin.create({
                email: req.body.email,
                password: secPassword,
            })



            const data = {
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            console.log({ success, authToken });
            res.json({ success, authToken });





        }


        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }


        // .then(user => res.json(user))
        // .catch(err=> {console.log(err)
        // res.json({error:"Email is already in use", message:err.message})});

    })































// ----------------------------------------------------------------------------------------




//**** For creating user /auth/userdetails        ---- No LOGIN REQUIRED  ----- */

router.post('/page2/userdetails', [

    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('gender', "Enter a valid Valid gender"),
    body('category', "Enter a valid category"),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter valid password").isLength({ min: 5 }),
    body('about', "Enter a valid about")


],


    async (req, res) => {
        //console.log(req.body);

        //********************** */ For storing data into mongo database without validation
        // const user = User(req.body);
        // user.save();

        let success = false;


        try {


            //*********Express validation */
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }

            let organizer = await Organizer.findOne({ email: req.body.email });
            if (organizer) {
                return res.status(400).json({ success, error: "Sorry, a organizer with this email already exists..." });
            }



            //Hashing the password to secure it using bcryptJS
            const salt = await bcrypt.genSaltSync(10);
            const secPassword = await bcrypt.hash(req.body.password, salt);


            organizer = await Organizer.create({
                name: req.body.name,
                gender: req.body.gender,
                category: req.body.category,
                email: req.body.email,
                password: secPassword,
                about: req.body.about
            })



            const data = {
                organizer: {
                    id: organizer.id
                }
            }

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            console.log({ success, authToken });
            res.json({ success, authToken });



            //res.json({success: "User created successfully"});


        }


        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }


        // .then(user => res.json(user))
        // .catch(err=> {console.log(err)
        // res.json({error:"Email is already in use", message:err.message})});

    })






// *****************************************************************************************





//**** To login the user with correct creds   /auth/login        ---- No LOGIN REQUIRED  ----- */
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()

], async (req, res) => {


    let success = false;

    try {


        //*********Express validation */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.json({ success, error: "Please check your credentials!" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.json({ success, error: "Please enter a valid password!" });
        }


        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

        //res.json({success: "User created successfully"});


    }


    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }



})








// ---------------------------------------------------------------


//**** To login the user with correct creds   /auth/adminlogin        ---- No LOGIN REQUIRED  ----- */
router.post('/adminlogin', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()

], async (req, res) => {


    let success = false;

    try {


        //*********Express validation */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { email, password } = req.body;

        let user = await Admin.findOne({ email });
        if (!user) {
            return res.json({ success, error: "Please check your credentials!" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.json({ success, error: "Please enter a valid password!" });
        }


        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });



    }


    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }



})






// -----------------------------------------------------------------



// FOR DELETING THE USEER

router.delete('/deleteuser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user with the given ID exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// **** Validate and track Daily View Limits for Free Users
router.post('/viewprofile/:targetId', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        // If Premium, bypass limits completely
        if (user.plan && user.plan !== "free") {
            // Check if plan expired
            if (user.planExpiry && new Date() > new Date(user.planExpiry)) {
                user.plan = "free";
                user.planExpiry = null;
                await user.save();
                return res.json({ success: false, allowed: false, message: "Your Premium Plan has expired. Re-upgrade to view profiles!" });
            }
            return res.json({ success: true, allowed: true });
        }

        // Handle Free User View Limits
        const today = new Date().toISOString().slice(0, 10);
        if (!user.dailyViews || user.dailyViews.date !== today) {
            // Reset limit counter for the new day
            user.dailyViews = { date: today, count: 1 };
        } else {
            if (user.dailyViews.count >= 10) {
                return res.json({ success: false, allowed: false, message: "Free users can only view 10 profiles a day. Upgrade to Premium!" });
            }
            user.dailyViews.count += 1;
        }
        await user.save();

        return res.json({ success: true, allowed: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// **** Payment Mock & Membership Updater Engine
router.post('/gopremium', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { planTier } = req.body; // "7days", "1month", "6months"

        if (!["7days", "1month", "6months"].includes(planTier)) {
            return res.status(400).json({ success: false, message: "Invalid Plan" });
        }

        const user = await User.findById(userId);
        let daysToAdd = 0;

        if (planTier === "7days") daysToAdd = 7;
        if (planTier === "1month") daysToAdd = 30;
        if (planTier === "6months") daysToAdd = 180;

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + daysToAdd);

        user.plan = planTier;
        user.planExpiry = expiryDate;

        await user.save();

        res.json({ success: true, message: `Successfully upgraded to ${planTier} Premium Plan!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Payment Validation Error" });
    }
});

// **** Send Interest Logic
router.post('/sendinterest', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetEmail } = req.body;

        const me = await User.findById(userId);
        const target = await User.findOne({ email: targetEmail });

        if (!target) return res.json({ success: false, message: "User not found" });

        // Check if mutual match exists already
        if (me.matches && me.matches.includes(targetEmail)) {
            return res.json({ success: false, message: "You are already matched!" });
        }

        // Add to sent
        if (!me.interestsSent.includes(targetEmail)) {
            me.interestsSent.push(targetEmail);
            await me.save();
        }

        // Add to received for target
        if (!target.interestsReceived.includes(me.email)) {
            target.interestsReceived.push(me.email);

            // Auto match if they also sent you one previously
            if (me.interestsReceived && me.interestsReceived.includes(targetEmail)) {
                me.matches.push(targetEmail);
                target.matches.push(me.email);

                await me.save();
                await target.save();
                return res.json({ success: true, message: "Mutual Match! You can now chat." });
            }
            await target.save();
        }

        res.json({ success: true, message: "Interest sent!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});











// **** To get the user details   /auth/getuser        ---- LOGIN REQUIRED  ----- */
router.get('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        res.send(user);
    }

    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})

// **** To update the user details   /auth/updateuser        ---- LOGIN REQUIRED  ----- */
router.put('/updateuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        let { name, age, phone, caste, dob, state, district, height, weight, education, working, description, gender } = req.body;

        // Anti-cheat verification
        description = antiCheatFilter(description);
        name = antiCheatFilter(name);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: { name, age, phone, caste, dob, state, district, height, weight, education, working, description, gender }
        }, { new: true }).select('-password');

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});




// For getting particular user details
router.get('/getuserbyid', async (req, res) => {

    try {
        const userId = req.header("id");

        const user = await User.findById(userId).select('-password');
        res.send(user);
    }

    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})















// API endpoint to fetch organizer data
router.get('/getusers', async (req, res) => {
    try {
        const organizers = await User.find();
        res.status(200).json(organizers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching organizer data' });
    }
});










router.post('/sendmail', async (req, res) => {
    try {
        const { to, senderEmail, subject, description, senderName } = req.body;
        console.log("Name", senderEmail);

        // Anti-cheat verification
        const filteredMessage = antiCheatFilter(description);

        // Save the message in the database
        await Message.create({
            to: to,
            from: senderEmail,
            senderName: senderName,
            subject: subject,
            message: filteredMessage
        });

        res.json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error while sending message' });
    }
});

// API endpoint to fetch messages received by the user
router.get('/getmessages', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const messages = await Message.find({ to: user.email }).sort({ date: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// API endpoint to fetch a conversation between the logged in user and another user
router.get('/getconversation/:otherEmail', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const otherEmail = req.params.otherEmail;
        const myEmail = user.email;

        // Find messages where (to = me AND from = other) OR (to = other AND from = me)
        const messages = await Message.find({
            $or: [
                { to: myEmail, from: otherEmail },
                { to: otherEmail, from: myEmail }
            ]
        }).sort({ date: 1 }); // Sort chronologically

        // Also fetch the name of the user I am talking to
        const otherUser = await User.findOne({ email: otherEmail });
        const otherName = otherUser ? otherUser.name : otherEmail;

        res.status(200).json({ messages, otherName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching conversation' });
    }
});













router.post('/email-send', [
    body('email', "Enter a valid email").isEmail()

], async (req, res) => {


    let success = false;

    try {


        //*********Express validation */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { email } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({ success, error: "Email does not exits!" });
        }


        let otpcode = Math.floor((Math.random() * 10000) + 1)

        let otpData = new Otp({
            email: req.body.email,
            otp: otpcode,
            expiredIn: new Date().getTime() + 300 * 1000
        })


        let otpResponse = await otpData.save();
        success = true




        ////For sending mail



        if (otpResponse) {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'yourmail@gmail.com',
                    pass: 'yourapppassword',
                },
            });


            let mailOptions = {
                from: 'yourmail@gmail.com',
                to: email,
                subject: otpcode,
                html:
                    `<div style="padding:10px;" >
            <p>Your OTP is</p>
            <ul>
            <li>OTP: ${otpcode}</li>
      
            </ul>
          </div>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error sending email');
                } else {
                    console.log('Email sent: ' + info.response);
                    success = true
                    res.status(200).send('Email sent successfully');
                }
            });


        }



        res.json({ success });



    }


    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }



})




router.post("/otp-verify", async (req, res) => {
    const { otp, password, email } = req.body;
    console.log(password)
    console.log(email)


    let myotp = await Otp.findOne({ otp });
    if (!myotp) {
        success = false
        return res.status(400).json({ success, error: "Incorrect OTP" });
    }



    // let user = await User.updateOne({email:email}, {$set:{
    //     password:secPassword
    // }} );
    // console.log(user);

    //Hashing the password to secure it using bcryptJS
    const salt = await bcrypt.genSaltSync(10);
    const secPassword = await bcrypt.hash(password, salt);
    let user = await User.updateOne({ email: email }, {
        $set: {
            password: secPassword
        }
    });

    // user.password = secPassword;
    success = true;
    res.status(200).json({ success, message: "Password Changed Successfully..." });





})













module.exports = router;