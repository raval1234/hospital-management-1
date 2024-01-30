import express from "express";
import validate from "express-validation";
import hospitalParams from "../params/hospital.params";
import hospital from "../beans/hospital";
// import {authorize, userAuthorize} from '../beans/auth';
const router = express.Router();

// router.use(authorize);

router.post(
  "/create",
  validate(hospitalParams.hospital_create),
  hospital.c_hospital
);

router.put(
  "/update",
  validate(hospitalParams.hospital_update),
  hospital.update_hospital
);

router.get(
  "/get",
  validate(hospitalParams.hospital_get),
  hospital.get_hospital
);

router.get("/list", hospital.list_hospital);

router.delete(
  "/delete",
  validate(hospitalParams.hospital_delete),
  hospital.d_hospital
);

module.exports = router;
