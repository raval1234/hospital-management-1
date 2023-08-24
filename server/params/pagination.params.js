import Joi from 'joi';

const paginationParams = {
  pagination: {
    query: Joi.object({
      page_size: Joi.number().required(),
      page_number: Joi.number().required(),
    }),
  },
};

export default paginationParams;
