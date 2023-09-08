import express from 'express';
import validate from 'express-validation';
import appointmentParams from '../params/apppointment.params';
import appointment from '../beans/appointments';
const router = express.Router();

router
  .route('/appoint-create')
  //** POST appointment/appoint_create - appointment create*/
  .post(validate(appointmentParams.appoint_create), appointment.c_appoint);

router
  .route('/appoint-list')
  //** GET appointment/appoint_list - appointment list_appoint*/
  .get(appointment.list_appoint);

router
  .route('/checkout')
  //** GET appointment/checkout_patient - checkout_patient*/
  .get(
    validate(appointmentParams.checkout_patient),
    appointment.checkout_patient
  );

router
  .route('/date-filter')
  //** GET appointment/ - date_filter*/
  .get(appointment.date_filter);

router
  .route('/listAppointments')
  //** GET appointment/listAppointments - appointment list_appoint*/
  .get(appointment.listAppointments);

module.exports = router;
