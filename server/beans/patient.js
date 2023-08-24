import Patient from '../../server/models/patient';
import Rooms from '../../server/models/room';
import Appoint from '../../server/models/appointment';
import nodemailer from 'nodemailer';
import config from '../../config/config';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

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

    if (patient_exi) return res.status(400).send('patient alredy exist');

    let patients = await Patient.create({
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
    console.log(patients);

    if (!patients) return res.status(400).send('patient data not create');

    const userData = await Patient.findOne({ email });
    console.log(userData.first_name);
    if (!userData) return res.status(400).send('patient Email not Find');

    sendcreatemail(userData.first_name, userData.email);

    next(patients);
    // res.status(200).json({patients});
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function list_patient(req, res, next) {
  try {
    let srt = await Patient.find({}).select(
      '-_id first_name last_name email dob gender weight height diseases doctor'
    );

    if (!srt) return res.status(400).send('patient data not create');

    next(srt);
    // res.status(200).json({srt});
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

    if (!srt) return res.status(400).send('patient data not create');

    next(srt);
    // res.status(200).json({srt});
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

    if (!srt) return res.status(400).send('patient data not create');

    next(srt);
    // res.status(200).json({srt});
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
    if (!fd_patient) return res.status(400).send('Data Not find Patient');

    let fd_appointment = await Appoint.find({ patientId: _id });
    if (!fd_appointment)
      return res.status(400).send('Data Not find Patient Appointment');
    console.log(fd_appointment);

    for (const d of fd_appointment) {
      let fd_Room = await Rooms.find({ _id: d.Room });
      if (!fd_Room) return res.status(400).send('Data Not find Patient Rooms');

      let update_room = await Rooms.findOneAndUpdate(
        { _id: d.Room },
        { available: true }
      );
      if (!update_room)
        return res.status(400).send('Data Not deleted Patient Rooms');

      console.log(update_room);
    }

    let dlt_patient = await Patient.findByIdAndDelete({ _id });
    if (!dlt_patient) return res.status(400).send('Data Not deleted : Patient');

    let dlt_appointment = await Appoint.findOneAndDelete({ patientId: _id });
    if (!dlt_appointment)
      return res.status(400).send('Data Not deleted : Appointment');

    next(fd_patient, fd_appointment);
    // res.status(200).json({ fd_patient, fd_appointment});
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function update_patient(req, res, next) {
  try {
    let { _id, email, weight } = req.query;

    let update = await Patient.updateOne(
      { _id },
      { email, weight: parseInt(weight) }
    );
    if (!update) return res.status(400).send('Data Not find');

    next(update);
    // res.status(200).json({update});
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
