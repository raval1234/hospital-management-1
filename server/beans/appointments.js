import Appointment from '../models/appointment';
import Rooms from '../models/room';
import Patient from '../models/patient';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

async function c_appoint(req, res, next) {
  try {
    let { reason, time, email, doctor, room } = req.body;

    let find_room = await Rooms.findOneAndUpdate(
      { name: room },
      { availability: false }
    );
    if (!find_room) return res.status(400).send('Room Not Found');

    let find_patient = await Patient.findOne({ email });
    if (!find_patient) return res.status(400).send('Patient Not Found');

    let appointments = await Appointment.create({
      reason,
      time,
      doctor,
      patient: find_patient._id,
      roomId: find_room._id,
    });

    if (!appointments)
      return res.status(400).send('appointments data not create');

    // res.status(200).json({appointments});
    next(appointments);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function list_appoint(req, res, next) {
  try {
    let srt = await Appointment.find({}).select(
      '-_id reason time doctorId patienId Room'
    );

    if (!srt) return res.status(400).send('patient data not create');

    next(srt);
    res.status(200).json({ srt });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function checkout_patient(req, res, next) {
  try {
    let email = req.query.email;
    // console.log(eml);

    let patients = await Patient.find({
      email,
    }).select('_id first_name');

    if (!patients) return res.status(400).send('patient data not create');
    // console.log(patients[0]._id);

    let appoint = await Appointment.find({
      patientId: patients[0]._id,
    }).select('patientId Room');

    if (!appoint) return res.status(400).send('patient data not create');
    // console.log(appoint);

    let room = await Rooms.updateOne(
      { _id: appoint[0].Room },
      { available: false }
    );
    if (!room) return res.status(400).send('patient data not create');
    console.log(room);

    next(patients);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

module.exports = {
  c_appoint,
  checkout_patient,
  list_appoint,
};

// console.log("date", moment("2023-08-09").format())
// const moment = require("moment");
