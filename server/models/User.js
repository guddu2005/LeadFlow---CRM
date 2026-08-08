const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    role: {
        type: String,
        enum: ["admin", "manager", "researcher", "user", "Admin", "Manager", "Researcher", "User"],
        default: "researcher",
        set: v => (v ? v.toLowerCase() : "researcher")
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    });


// password hashing
userSchema.pre('save' , async function(){
    if(!this.isModified('password')){
        return;
    }

    this.password = await bcrypt.hash(this.password , 10);  
});


//password comparison

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword , this.password);
}

userSchema.methods.getResetPasswordToken = function () {

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store hashed token in DB
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Token expires in 15 minutes
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    // Return plain token
    return resetToken;
};

module.exports = mongoose.model("User",userSchema);