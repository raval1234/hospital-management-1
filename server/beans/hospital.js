import Hospital from '../../server/models/hospital';
import Appointment from '../../server/models/appointment';
import Doctor from '../../server/models/doctrors';
import Rooms from '../../server/models/room';
import APIError from '../helpers/APIError';
import Patient from '../../server/models/patient';
import { ErrMessages, SuccessMessages } from '../helpers/AppMessages';


async function c_hospital(req, res, next) {
  try {
    let { name, address, call_num, doctorsId } = req.body;

    let data = await Hospital.create({
      name,
      address,
      call_num,
      doctorsId,
    });
    if (!data) return next(
      new APIError(ErrMessages.dataNotCreated, httpStatus.UNAUTHORIZED, true)
    );

    next(SuccessMessages.hospitalCreated);

  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function d_hospital(req, res, next) {
  try {
    let _id = req.query._id;

    let hptl = await Hospital.findOne({ _id });
    if (!hptl) return next(
      new APIError(ErrMessages.hospitalNotFound, httpStatus.UNAUTHORIZED, true)
    );

    if (hptl) {
      for (const d of hptl.doctorsId) {
        let doctor = await Doctor.find({ _id: d });
        if (doctor) {
          let patient = await Patient.find({ doctor: d });
          let appointment = await Appointment.findOne({ doctorId: d });

          if (appointment) {
            await Rooms.updateOne(
              { _id: appointment.Room },
              { available: true }
            );
            await Appointment.deleteOne({ doctorId: d });
          }
          if (patient) await Patient.deleteOne({ doctor: d });
          await Doctor.deleteOne({ _id: d });
        }
      }
      await Hospital.deleteOne({ _id: hospita_id });
    }
    next(SuccessMessages.hospitalDelete);

  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function list_hospital(req, res, next) {
  try {
    let srt = await Hospital.find({}).select(
      '-_id name address call_num doctorsId'
    );

    if (!srt) return next(
      new APIError(ErrMessages.hospitalNotFound, httpStatus.UNAUTHORIZED, true)
    );

    next(srt);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function get_hospital(req, res, next) {
  try {
    let _id = req.query._id;

    let hptl = await Hospital.find({ _id });

    if (!hptl) return next(
      new APIError(ErrMessages.hospitalNotFound, httpStatus.UNAUTHORIZED, true)
    );

    next(hptl);
    // res.status(200).json({ hptl });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function update_hospital(req, res, next) {
  try {
    let { _id, address } = req.query;

    let hptl = await Hospital.updateOne({ _id }, { address });

    if (!hptl) return next(
      new APIError(ErrMessages.hospitalUpdateFailed, httpStatus.UNAUTHORIZED, true)
    );

    next(SuccessMessages.hospitalUpdate);

  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

module.exports = {
  c_hospital,
  d_hospital,
  update_hospital,
  get_hospital,
  list_hospital,
};
