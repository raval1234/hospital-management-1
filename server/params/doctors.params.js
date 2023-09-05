import Joi from 'joi';

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
    query: Joi.object({
      ids: Joi.string().hex().required(),
      email: Joi.string().required(),
      // name: Joi.string().required()
    }),
  }, 
};

export default doctorParams;
