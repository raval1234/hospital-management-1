import Patient from '../../server/models/patient';
import APIError from '../helpers/APIError';

async function pagination(req, res, next) {
  try {
    let { page_size, page_number } = req.query;
    page_size = parseInt(page_size);
    page_number = parseInt(page_number);
    let data = await Patient.aggregate([
      { $project: { first_name: 1, last_name: 1, email: 1, gender: 1 } },
      { $skip: (page_number - 1) * page_size },
      { $limit: page_size },
    ]);

    console.log('daata', data);
    let patientList = await Patient.find({})
      .select(' first_name last_name email gender')
      .skip((page_number - 1) * page_size)
      .limit(page_size);

    let totalCount = await Patient.find({}).countDocuments();
    let totalPage = Math.ceil(totalCount / page_size);
    next(patientList, totalPage, page_number);
    res.status(200).json({ patientList, totalPage, page_number });
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
    res.status(200).json({ dts });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

module.exports = {
  pagination,
};
