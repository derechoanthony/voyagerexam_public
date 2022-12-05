const userModel = require('../models/user');
const companyModel = require('../models/company')

const getUser = async(userData) =>{
    const query = companyModel.aggregate(
        [   {
            $lookup: {
                    from: "users",
                    localField: "id",
                    foreignField: "id",
                    as: "company_user"
                    }
            },
            {
                $match:{
                    name: userData
                }
            }
        ]
        )
    // const user = userModel.find({"id":"1"});
    const result =  await query;
    const company_user = [];
    let company_info = result[0];
    company_info.company_user.map(v=>{
        let {_id, ...others} = v;
        company_user.push(others)
    });

    const response = {
        "id":company_info.id,
        "name":company_info.name,
        "created_at":company_info.created_at,
        "users":company_user,
    };
    console.log(response)
    
    return response
}

module.exports = {
    getUser
}