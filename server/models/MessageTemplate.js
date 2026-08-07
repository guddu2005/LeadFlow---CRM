const mongoose = require("mongoose");

const messageTemplateSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    channel:{
        type:String,
        enum:[
            "Email",
            "LinkedIn",
            "Phone"
        ],
        required:true
    },

    version:{
        type:String,
        enum:[
            "A",
            "B",
            "C"
        ],
        default:"A"
    },

    subject:{
        type:String,
        trim:true,
        default:""
    },

    message:{
        type:String,
        required:true
    },

    variables:[
        {
            type:String
        }
    ],

    isActive:{
        type:Boolean,
        default:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    isDeleted:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

module.exports = mongoose.model(
    "MessageTemplate",
    messageTemplateSchema
);