import express from 'express';
import validate from 'express-validation';
import appointmentParams from '../params/apppointment.params';
import appointment from'../beans/appointments';
const router = express.Router();

router
  .route('/appointcre')
  //** POST appointment/appoint_create - appointment create*/
  .post(validate(appointmentParams.appoint_create), appointment.c_appoint);

router
  .route('/appointlist')
  //** GET appointment/appoint_list - appointment list_appoint*/
  .get(appointment.list_appoint);

router
  .route('/checkout')
  //** GET appointment/checkout_patient - checkout_patient*/
  .get(validate(appointmentParams.checkout_patient),appointment.checkout_patient);

module.exports = router;
