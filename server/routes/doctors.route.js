import express from 'express';
import validate from 'express-validation';
import doctorParams from '../params/doctors.params';
import doctor from'../beans/doctor';
const router = express.Router();


router.post('/doctorcre',validate(doctorParams.doctor_create), doctor.c_doctor);
router.get('/pddata', doctor.pd_data);
router.put('/updatedoctor',validate(doctorParams.doctor_update), doctor.update_doctor);
router.get('/doctorlist', doctor.list_patient);
router.get('/doctorappoint', doctor.appoint_doctor);


module.exports = router;

 