import Joi from 'joi';

const appointmentParams = {
  appoint_create: {
    body: Joi.object({
      reason: Joi.string().required(),
      time: Joi.date().required(),
      doctor: Joi.string().hex().required(),
      //   patient: Joi.string().hex().required(),
      room: Joi.string().required(),
    }),
  },
  checkout_patient: {
    query: Joi.object({
      email: Joi.string().required(),
    }),
  },
};

export default appointmentParams;
