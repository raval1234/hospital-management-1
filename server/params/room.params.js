import Joi from 'joi';

const roomParams = {
  room_create: {
    body: Joi.object({
      name: Joi.string().required(),
      available: Joi.boolean().required(),
    }),
  },
};

export default roomParams;
