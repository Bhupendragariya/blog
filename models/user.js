const {Schema, model, Error} = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    fullName:{
        type: String,
        require: true,
    },

    email:{
        type: String,
        require: true,
        unique: true,

    },

 

    
    password:{
        type: String,
        require: true,
        
    },
    profileImageURL:{
        type: String,
        default : "/images/avitar.jpg"

    },

    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }

}, {timestamps: true});


userSchema.pre('save', async function(next) {
    if (!this.isModified("password")) return next()


        try {
            this.password = await bcrypt.hash(this.password, 10);
            next();
        } catch (err) {
            next(err); 
        }
});

userSchema.methods.isPasswordCorrect = async function(Password) {
    return await bcrypt.compare(Password, this.password)
}

const User = model("User", userSchema);

module.exports =  User;