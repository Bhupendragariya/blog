const path = require("path")
const express = require("express")
const  mongoose = require("mongoose")
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')

const Blog = require('./models/blog.js')

const userRoute = require('./routes/user.js')
const blogRoute = require('./routes/blog.js')



const { checkForAuthenticationCookie } = require("./middlewares/authentication.js")

dotenv.config();
const app = express();
const PORT = process.env.PORT;


mongoose.connect(`${process.env.MONGODB_URI}`).then(() =>{
     console.log("mongodb connected");
console.log("connected to db ", mongoose.connection.name);
}).catch(err =>{
    console.error("mogoDb connection errror:", err)
})

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))


app.use(express.static(path.resolve("./public")))



app.get('/',  async(req, res) => {
        const allBlogs = await Blog.find({});
        res.render("home", {
            user: req.user,
            blogs: allBlogs,
        });
        
 
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);



app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`))