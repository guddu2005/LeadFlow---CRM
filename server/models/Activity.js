const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
{
    lead:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lead",
        required:true
    },
    activityType:{
        type:String,
        enum:[
            "LinkedIn Connection",
            "LinkedIn Message",
            "Email",
            "Phone Call",
            "Meeting",
            "Research Interview",
            "Note",
            "Status Change",
            "Other"
        ],
        required:true
    },

    subject:{
        type:String,
        trim:true,
        required:true
    },

    description:{
        type:String,
        default:""
    },

    outcome:{
        type:String,
        enum:[
            "Pending",
            "Completed",
            "No Response",
            "Interested",
            "Not Interested",
            "Booked"
        ],
        default:"Pending"
    },

    activityDate:{
        type:Date,
        default:Date.now
    },

    nextFollowUp:{
        type:Date,
        default:null
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    isDeleted:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
}
);

module.exports = mongoose.model(
    "Activity",
    activitySchema
);