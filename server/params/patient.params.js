import Joi from 'joi';

const patientParams = {
  patient_create: {
    body: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().required(),
      dob: Joi.date().required(),
      gender: Joi.string().required(),
      weight: Joi.number().required(),
      height: Joi.number().required(),
      diseases: Joi.array().items(Joi.string()).required(),
      doctor: Joi.string().hex().required(),
    }),
  },
  patient_update: {
    query: Joi.object({
      _id: Joi.string().hex().required(),
      email: Joi.string().required(),
      weight: Joi.number().required(),
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
