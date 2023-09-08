import express from 'express';
import validate from 'express-validation';
import patientParams from '../params/patient.params';
import patient from '../beans/patient';
const router = express.Router();

router.post(
  '/patientcre',
  validate(patientParams.patient_create),
  patient.c_patient
);
// router.post('/patientcre', patient.c_patient);

router.get('/sortpatient', patient.sort_patient);
router.get('/patientlist', patient.list_patient);
router.get(
  '/searchpatient',
  validate(patientParams.patient_search),
  patient.search_patient
);
router.put(
  '/updatepatient',
  validate(patientParams.patient_update),
  patient.update_patient
);
router.get(
  '/deletepatient',
  validate(patientParams.patient_delete),
  patient.delete_patient
);

module.exports = router;
