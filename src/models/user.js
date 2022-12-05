const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const userSchema = mongoose.Schema(
        {
            id:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        company_id:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true
    }
);
userSchema.plugin(toJSON);

const user = mongoose.model('user', userSchema);

module.exports = user;