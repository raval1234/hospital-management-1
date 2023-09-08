import Joi from 'joi';

const hospitalParams = {
  hospital_create: {
    body: Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      call_num: Joi.string().required(),
      doctorsId: Joi.array().items(Joi.string().hex()),
    }),
  },
  hospital_update: {
    body: Joi.object({
      _id: Joi.string().hex().required(),
    }),
  },
  hospital_delete: {
    query: Joi.object({
      _id: Joi.string().hex().required(),
    }),
  },
  hospital_get: {
    query: Joi.object({
      _id: Joi.string().hex().required(),
    }),
  },
};

export default hospitalParams;
