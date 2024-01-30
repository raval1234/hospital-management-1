import Joi from "joi";

const patientParams = {
  patient_create: {
    body: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().required(),
      dob: Joi.date(),
      gender: Joi.string().required(),
      weight: Joi.number(),
      height: Joi.number(),
      diseases: Joi.array().items(Joi.string()).required(),
      doctor: Joi.string().hex().required(),
    }),
  },
  patient_update: {
    query: Joi.object({
      petientId: Joi.string().hex().required(),
    }),
    body: Joi.object({
      first_name: Joi.string(),
      last_name: Joi.string(),
      dob: Joi.date(),
      gender: Joi.string(),
      weight: Joi.number(),
      height: Joi.number(),
      diseases: Joi.array().items(Joi.string()),
    }),
  },
  patient_search: {
    query: Joi.object({
      email: Joi.string().required(),
    }),
  },
  patient_delete: {
    query: Joi.object({
      email: Joi.string().required(),
    }),
  },
};

export default patientParams;
