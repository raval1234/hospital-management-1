import express from "express";
import validate from "express-validation";
import doctorParams from "../params/doctors.params";
import doctor from "../beans/doctor";
const router = express.Router();

router.post("/create", validate(doctorParams.doctor_create), doctor.c_doctor);

router.get("/patientList", doctor.pd_data);

router.put("/update",validate(doctorParams.doctor_update),doctor.update_doctor);

router.get("/list", doctor.list_doctor);

router.get("/doctorappoint", doctor.appoint_doctor);

module.exports = router;
