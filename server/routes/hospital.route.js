import express from 'express';
import validate from 'express-validation';
import hospitalParams from '../params/hospital.params';
import hospital from'../beans/hospital';
const router = express.Router();


router.post('/hospitalcre', validate(hospitalParams.hospital_create),hospital.c_hospital);
router.get('/hospitaldlt', validate(hospitalParams.hospital_delete),hospital.d_hospital);
router.put('/hospitalupdate', validate(hospitalParams.hospital_update),hospital.update_hospital);
router.get('/hospitalget', validate(hospitalParams.hospital_get), hospital.get_hospital);
router.get('/hospitallist', hospital.list_hospital);


module.exports = router;

