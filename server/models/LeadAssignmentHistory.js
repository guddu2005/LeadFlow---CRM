const mongoose = require("mongoose");

const leadAssignmentHistorySchema = new mongoose.Schema(
{
    lead:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lead",
        required:true
    },

    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    assignedAt:{
        type:Date,
        default:Date.now
    }

},
{
    timestamps:true
});


module.exports = mongoose.model(
    "LeadAssignmentHistory",
    leadAssignmentHistorySchema
);