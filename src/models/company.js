const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const companySchema = mongoose.Schema(
        {
            id:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true
    }
);
companySchema.plugin(toJSON);

const company = mongoose.model('company', companySchema);

module.exports = company;