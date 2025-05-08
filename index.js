const path = require("path")
const express = require("express")
const  mongoose = require("mongoose")


const userRoute = require('./routes/user.js')


const app = express();
const PORT = 8000;


mongoose.connect("mongodb+srv://bhupii:bhupii123@cluster0.ooo9w0d.mongodb.net").then(e => console.log("mongodb connected"))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.render("home")
})

app.use('/user', userRoute)



app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`))