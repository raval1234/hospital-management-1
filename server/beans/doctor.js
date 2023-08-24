import Doctor from '../../server/models/doctrors';
import Patient from '../../server/models/patient';
import Hospital from '../../server/models/hospital';
import Appointment from '../../server/models/appointment';
import APIError from '../helpers/APIError';

// import { mailchimp_email, mailchimp_api_key} from '../../bin/www';
// const mailchimp = require('@mailchimp/mailchimp_transactional')(mailchimp_api_key);
// /**
//  *
//  * @param {string} name - user name
//  * @param {string} toEmail - user email
//  * @param {string} password - password
//  * @returns {Promise}
//  */
// const sendPasswordMail = async (name, toEmail) => {
// console.log("detail", name, toEmail, mailchimp_email)
// const msg = {
//     message: {
//         from_email: mailchimp_email,
//         subject: "User's Password",
//         to: [{ email: toEmail, type: "to" }],
//         html: `<p>Hello User, ${name}</p>
//         <p>Welcome !</p>`
//     }
// }

//     console.log('msg :'+msg);
//     let sender = await sendMail(msg);
//     console.log('sender:'+sender);
//     }

//     /**
//      *
//      * @param {string} msg - message template
//      */
//     async function sendMail(msg) {
//     await mailchimp.messages.send(msg).then((res) => {
//         console.log('Email sent');
//     })
//     .catch((error) => { console.error(error)})
//     }
//     sendPasswordMail("Jay", "jaymdtech@gmail.com");

async function c_doctor(req, res, next) {
  try {
    let { name, call_num, email, gender, hospitalId } = req.body;

    let data = await Doctor.create({
      name,
      call_num,
      email,
      gender,
      hospitalId,
    });

    if (!data) return res.status(400).send('Data not Created');
    console.log(data._id);

    let doctor_id = await Hospital.findByIdAndUpdate(
      { _id: data.hospitalId },
      { $push: { doctors: data._id } }
    );

    if (!doctor_id) return res.status(400).send('Doctor id not not Found');

    const userData = await Doctor.findOne({ email });
    console.log(userData.name);
    if (!userData) return res.status(400).send('patient Email not Find');

    // sendcreatemail(userData.name,userData.email);
    sendEmailToUser(userData.email);

    next(data, doctor_id);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function list_patient(req, res, next) {
  try {
    let srt = await Doctor.find({}).select(
      '-_id name call_num email gender hospitalId'
    );

    let srts = await Doctor.aggregate([
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          call_num: 1,
          gender: 1,
          hospitalId: 1,
        },
      },
    ]);

    if (!srt) return res.status(400).send('patient data not create');

    next(srts);
    // res.status(200).json({srts});
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
      // {
      //     $project:
      //     {
      //         doctor: {$first:"$enrollee_info"},
      //         email: {$first:"$enrollee_info.email"}
      //     }
      // },
      // {
      //     $sort:{
      //      email:1
      //     }
      // }
    ]);
    next(dts);
    // res.status(200).json({dts});
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function update_doctor(req, res, next) {
  try {
    let { _id, email } = req.query;

    let update = await Doctor.updateOne({ _id }, { email });
    if (!update) return res.status(400).send('Data Not find');

    next(update);
    res.status(200).json({ update });
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
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'enrollee_info',
        },
      },
      {
        $project: {
          doctor: { $first: '$enrollee_info' },
          // email: {$first:"$enrollee_info.email"}
        },
      },
      // {
      //     $sort:{
      //      email:1
      //     }
      // }
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
  c_doctor,
  pd_data,
  update_doctor,
  list_patient,
  appoint_doctor,
};
