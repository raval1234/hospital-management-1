import Doctor from "../../server/models/doctrors";
import Patient from "../../server/models/patient";
import Hospital from "../../server/models/hospital";
import Appointment from "../../server/models/appointment";
import APIError from "../helpers/APIError";
import httpStatus from "http-status";
import { ErrMessages, SuccessMessages } from "../helpers/AppMessages";


async function c_doctor(req, res, next) {
  try {
    let { name, call_num, email, gender, hospitalId } = req.body;

    let doctor = await Doctor.findOne({ email: email });
    if (doctor)
      return next(
        new APIError(ErrMessages.doctorAlreadyExits, httpStatus.CONFLICT, true)
      );

    let data = await Doctor.create({
      name,
      call_num,
      email,
      gender,
      hospitalId,
    });

    let doctorUpdate = await Hospital.findByIdAndUpdate(
      { _id: data.hospitalId },
      { $push: { doctorsId: data._id } }
    );

    if (!doctorUpdate)
      return next(
        new APIError(ErrMessages.hospitalNotFound, httpStatus.NOT_FOUND, true)
      );

    next(SuccessMessages.doctorCreated);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function list_doctor(req, res, next) {
  try {
    let doctorList = await Doctor.find({});

    next(doctorList);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function update_doctor(req, res, next) {
  try {
    let doctorId = req.query.doctorId;
    let { name, call_num, email, gender } = req.body;


    let doctor = await Doctor.findOne({ _id:doctorId });
    if (!doctor) {
      return next(
        new APIError(ErrMessages.doctorNotFound, httpStatus.NOT_FOUND, true)
      );
    }

    let doctorEmail = await Doctor.findOne({ email:email });
    if (doctorEmail) {
      return next(
        new APIError(ErrMessages.EmailAlreadyEexist, httpStatus.CONFLICT, true)
      );
    }
    
    let updatedValue = {};
    if (name) updatedValue.name = name;
    if (call_num) updatedValue.call_num = call_num;
    if (email) updatedValue.email = email;
    if (gender) updatedValue.gender = gender;
    
    await Doctor.updateOne({ _id:doctorId }, updatedValue);

    next(SuccessMessages.doctorUpdateSuccess);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function appoint_doctor(req, res, next) {
  try {
    let dts = await Appointment.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "enrollee_info",
        },
      },
      {
        $project: {
          doctor: { $first: "$enrollee_info" },
          // email: {$first:"$enrollee_info.email"}
        },
      },
      // {
      //     $sort:{
      //      email:1
      //     }
      // }
    ]);

    if (!dts)
      return next(
        new APIError(
          ErrMessages.appointmentNotFound,
          httpStatus.UNAUTHORIZED,
          true
        )
      );

    next(dts);
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
          from: "doctors",
          localField: "doctor",
          foreignField: "_id",
          as: "enrollee_info",
        },
      },
    ]);

    if (!dts)
      return next(
        new APIError(ErrMessages.dataNotFound, httpStatus.UNAUTHORIZED, true)
      );

    next(dts);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

module.exports = {
  c_doctor,
  update_doctor,
  list_doctor,
  appoint_doctor,
  pd_data,
};
