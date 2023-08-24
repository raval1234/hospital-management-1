import Joi from 'joi';

require('dotenv').config();

const envVarsSchema = Joi.object({
  PORT: Joi.number(),
  MONGODB_URL: Joi.string(),
  JWTSECRET: Joi.string(),
  EXPIRESIN: Joi.string(),
  SALT: Joi.number(),
  ADMIN_NAME: Joi.string(),
  ADMIN_EMAIL: Joi.string(),
  ADMIN_PASSWORD: Joi.string(),
  ADMIN_PHONENUMBER: Joi.string(),
  ADMIN_PROFILE_PICTURE: Joi.string(),
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
  adminName: envVars.ADMIN_NAME,
  adminEmail: envVars.ADMIN_EMAIL,
  adminPassword: envVars.ADMIN_PASSWORD,
  adminPhoneNumber: envVars.ADMIN_PHONENUMBER,
  adminProfilePicture: envVars.ADMIN_PROFILE_PICTURE,
  emailUser: 'jaymdtech@gmail.com',
  emailPassword: 'yymbqhmnessgrdxa',
  mailchimp_email: envVars.MAILCHIMP_EMAIL,
  mailchimp_api_key: envVars.MAILCHIMP_API_KEY,
};

export default config;
