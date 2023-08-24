import Joi from 'joi';

const userParams = {
  user_create: {
    body: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().required(),
      dob: Joi.date().required(),
      gender: Joi.string().required(),
      weight: Joi.number().required(),
      height: Joi.number().required(),
      diseases: Joi.array().items(Joi.string()).required(),
      password: Joi.string()
        .min(8)
        .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
        .label(
          'Password must contain at least one upper case letter, one lower case letter, one number, and one special character.',
          'Password must be at least 8 characters long.'
        )
        .required(),
      tokens: Joi.string(),
      doctor: Joi.string().hex().required(),
    }),
  },
  reset_password: {
    body: Joi.object({
      password: Joi.string()
        .min(8)
        .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
        .label(
          'Password must contain at least one upper case letter, one lower case letter, one number, and one special character.',
          'Password must be at least 8 characters long.'
        )
        .required(),
    }),
  },
};

export default userParams;
