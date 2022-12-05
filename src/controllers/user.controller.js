const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { getUser } = require('../services/user');
const _ =  require('underscore')

const getUsers = catchAsync(async (req, res) => {

  let company_name = req.query.name;
  try {
    let user = await getUser(company_name);
    if(_.isEmpty(user)){
      throw new ApiError(httpStatus[204], 'No Content');
    }
    res.send(user);
  } catch (error) {
    throw new ApiError(httpStatus[500], error);
  }
  
});


module.exports = {
  getUsers
};
