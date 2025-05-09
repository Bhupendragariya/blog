const {Router} = require("express");
const User = require('../models/user.js');
const { createTokenForUser } = require("../utilities/authentication.js");

const router = Router()

router.get('/signin', (req, res) =>{
    return res.render("signin")
});

router.get('/signup', (req, res) =>{
    return res.render("signup")
});



router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
              return res.render('signin', {
                error: "Invalid email or password",
                email
            });
        }

        const isMatch = await user.isPasswordCorrect(password);

        if (!isMatch) {
              return res.render('signin', {
                error: "Invalid email or password",
                email
            });
        }


        const token = createTokenForUser(user);
   


        return res.cookie("token", token).redirect("/");

    } catch (error){
        console.error(error);
        return res.render('signin', { error: "Something went wrong. Please try again." });
    }
});


router.get('/logout', (req, res) =>{
    res.clearCookie('token');
    res.redirect("/");

})


router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already registered");
        }

        await User.create({
            fullName,
            email,
            password,
        });

        return res.redirect("/");
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).send("Internal server error");
    }
});


module.exports = router;
 