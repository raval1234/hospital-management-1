import Patient from '../../server/models/patient';
import Rooms from '../../server/models/room';
import Appoint from '../../server/models/appointment';
import nodemailer from 'nodemailer';
import config from '../../config/config';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import { ErrMessages, SuccessMessages } from '../helpers/AppMessages';
const ObjectId = require('mongoose').Types.ObjectId;

async function sendcreatemail(name, email) {
  try {
    const transporter = await nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const mailOptions = await {
      from: config.emailUser,
      to: email,
      subject: 'For Reset Password',
      html: '<p>Hii ' + name + ' this message from HMS project.</p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email Has been sent: ', info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}

async function c_patient(req, res, next) {
  try {
    let {
      first_name,
      last_name,
      email,
      dob,
      gender,
      weight,
      height,
      diseases,
      doctor,
    } = req.body;

    let patient_exi = await Patient.findOne({ email });

    if (patient_exi)
      return next(
        new APIError(
          ErrMessages.patientAlreadyEexist,
          httpStatus.UNAUTHORIZED,
          true
        )
      );

    await Patient.create({
      first_name,
      last_name,
      email,
      dob,
      gender,
      weight,
      height,
      diseases,
      doctor,
    });

    // console.log(patients);

    // if (!patients) return next(
    //   new APIError(ErrMessages.dataNotCreated, httpStatus.UNAUTHORIZED, true)
    // );

    // const userData = await Patient.findOne({ email });

    // if (!userData) return next(
    //   new APIError(ErrMessages.patientNotFound, httpStatus.UNAUTHORIZED, true)
    // );

    sendcreatemail(first_name, email);

    next(SuccessMessages.patientCreated);
    // res.status(200).json({patients});
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function list_patient(req, res, next) {
  try {
    let populate = [{ path: 'doctor', select: 'name' }];
    let srt = await Patient.find({})
      .select(
        '-_id first_name last_name email dob gender weight height diseases doctor'
      )
      .populate(populate);

    // let doctor =  req.query.doctor;
    // let srt = await Patient.find({doctor}).select('first_name last_name email dob gender weight height diseases');
    next(srt);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function sort_patient(req, res, next) {
  try {
    let srt = await Patient.find({})
      .sort({ first_name: 1 })
      .select('-_id first_name last_name');

    if (!srt)
      return next(
        new APIError(ErrMessages.patientNotFound, httpStatus.UNAUTHORIZED, true)
      );

    next(srt);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function search_patient(req, res, next) {
  try {
    let email = req.query.email;
    // let srt = await Patient.find( { email: { $regex: /^Robinia@gmail.com/i } } )
    // let srt = await Patient.find( { email: { $regex: eml ,$options: 'i'} } )
    let srt = await Patient.find({
      email: { $regex: email, $options: 'ix' },
    }).select('-_id first_name last_name');

    if (!srt)
      return next(
        new APIError(ErrMessages.patientNotFound, httpStatus.UNAUTHORIZED, true)
      );

    next(srt);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function delete_patient(req, res, next) {
  try {
    let _id = req.query._id;
    let fd_patient = await Patient.find({ _id });
    if (!fd_patient)
      return next(
        new APIError(ErrMessages.patientNotFound, httpStatus.UNAUTHORIZED, true)
      );

    let fd_appointment = await Appoint.find({ patientId: _id });
    if (!fd_appointment)
      return next(
        new APIError(
          ErrMessages.appointmentNotFound,
          httpStatus.UNAUTHORIZED,
          true
        )
      );

    for (const d of fd_appointment) {
      let fd_Room = await Rooms.find({ _id: d.Room });
      if (!fd_Room)
        return next(
          new APIError(ErrMessages.roomNotFound, httpStatus.UNAUTHORIZED, true)
        );

      let update_room = await Rooms.findOneAndUpdate(
        { _id: d.Room },
        { available: true }
      );

      if (!update_room)
        return next(
          new APIError(
            ErrMessages.roomUpdateFailed,
            httpStatus.UNAUTHORIZED,
            true
          )
        );
    }

    let dlt_patient = await Patient.findByIdAndDelete({ _id });
    if (!dlt_patient)
      return next(
        new APIError(
          ErrMessages.patientDeletedFailed,
          httpStatus.UNAUTHORIZED,
          true
        )
      );

    let dlt_appointment = await Appoint.findOneAndDelete({ patientId: _id });
    if (!dlt_appointment)
      return next(
        new APIError(
          ErrMessages.appointmentDeletedFailed,
          httpStatus.UNAUTHORIZED,
          true
        )
      );

    next(SuccessMessages.patientDeleted);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function update_patient(req, res, next) {
  try {
    let {
      _id,
      first_name,
      last_name,
      email,
      dob,
      gender,
      weight,
      height,
      diseases,
      doctor,
    } = req.query;

    let updatedValue = {};
    if (first_name) updatedValue.first_name = first_name;
    if (last_name) updatedValue.last_name = last_name;
    if (email) updatedValue.email = email;
    if (dob) updatedValue.dob = new Date(dob);
    if (gender) updatedValue.gender = gender;
    if (weight) updatedValue.weight = parseInt(weight);
    if (height) updatedValue.height = parseInt(height);
    if (diseases) updatedValue.diseases = diseases;
    if (doctor) updatedValue.doctor = new ObjectId(doctor);

    let update = await Patient.updateOne({ _id }, updatedValue);
    if (!update)
      return next(
        new APIError(
          ErrMessages.patientUpdateFailed,
          httpStatus.UNAUTHORIZED,
          true
        )
      );
    next(SuccessMessages.patientUpdate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  c_patient,
  sort_patient,
  search_patient,
  update_patient,
  delete_patient,
  list_patient,
};
