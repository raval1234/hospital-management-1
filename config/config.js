import Joi from 'joi';

require('dotenv').config();

const envVarsSchema = Joi.object({
  PORT: Joi.number(),
  MONGODB_URL: Joi.string(),
  JWTSECRET: Joi.string(),
  EXPIRESIN: Joi.string(),
  SALT: Joi.number(),
  MAILCHIMP_EMAIL: Joi.string(),
  MAILCHIMP_API_KEY: Joi.string(),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  port: envVars.PORT,
  mongoURL: envVars.MONGODB_URL,
  jwtSecret: envVars.JWTSECRET,
  expiresIn: envVars.EXPIRESIN,
  salt: envVars.SALT,
  emailUser: envVars.emailUser,
  emailPassword: envVars.emailPassword,
  mailchimp_email: envVars.MAILCHIMP_EMAIL,
  mailchimp_api_key: envVars.MAILCHIMP_API_KEY,
};

export default config;
