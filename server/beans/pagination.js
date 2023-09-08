import Patient from '../../server/models/patient';
import APIError from '../helpers/APIError';
import Doctor from '../../server/models/doctrors';

async function pagination(req, res, next) {
  try {
    let { page_size, page_number, search } = req.query;

    page_size = parseInt(page_size);
    page_number = parseInt(page_number);

    let searchCriteria = {};
    if (search) {
      searchCriteria = { gender: search };
    }
    console.log(searchCriteria);

    let data = await Patient.aggregate([
      { $match: searchCriteria },
      { $sort: { first_name: 1 } },
      { $project: { first_name: 1, last_name: 1, email: 1, gender: 1 } },
      { $skip: (page_number - 1) * page_size },
      { $limit: page_size },
    ]);

    console.log('data', data);

    let patientList = await Patient.find(searchCriteria)
      .select(' first_name last_name email gender')
      .skip((page_number - 1) * page_size)
      .limit(page_size);

    let totalCount = await Patient.find(searchCriteria).countDocuments();
    let totalPage = Math.ceil(totalCount / page_size);

    next({ data });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function pd_data(req, res, next) {
  try {
    // get data doctor of patient with populate
    // let populate = [{ path: 'doctor', select: '-_id name email'}]
    // let dt = await Patient.find({}).select('-_id first_name email').populate(populate);
    // if(!dt) return res.status(400).send('Data Not Found');

    // get data doctor of patient with aggregation $lookup
    let dts = await Patient.aggregate([
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'enrollee_info',
        },
      },
      {
        $project: {
          doctor: { $first: '$enrollee_info' },
          email: { $first: '$enrollee_info.email' },
        },
      },
      {
        $sort: {
          email: 1,
        },
      },
    ]);

    next(dts);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function pagination_doctor(req, res, next) {
  try {
    let { page_size, page_number, search } = req.query;

    page_size = parseInt(page_size);
    page_number = parseInt(page_number);

    let searchData = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      searchData = { email: searchRegex };
    }

    // console.log(searchData);

    let data = await Doctor.aggregate([
      { $match: searchData },
      { $sort: { name: 1 } },
      { $project: { name: 1, call_num: 1, email: 1, gender: 1 } },
      { $skip: (page_number - 1) * page_size },
      { $limit: page_size },
    ]);

    console.log('data');

    next(data);
  } catch (err) {
    return next(new APIError(err.message, true, err));
  }
}

module.exports = {
  pagination,
  pagination_doctor,
};
