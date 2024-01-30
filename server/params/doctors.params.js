import Joi from "joi";

const doctorParams = {
  doctor_create: {
    body: Joi.object({
      name: Joi.string().required(),
      call_num: Joi.string().required(),
      email: Joi.string().required(),
      gender: Joi.string().required(),
      hospitalId: Joi.string().hex().required(),
    }),
  },
  doctor_update: {
    body: Joi.object({
      email: Joi.string(),
      name: Joi.string(),
      call_num: Joi.number(),
      gender: Joi.string(),
    }),
    query: Joi.object({
      doctorId: Joi.string().hex().required(),
    }),
  },
};

export default doctorParams;
