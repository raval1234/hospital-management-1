import User from '../../server/models/user';
import bcrypts from 'bcrypt';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../../config/config';
import { ErrMessages, SuccessMessages } from '../helpers/AppMessages';
import { jwtSecret } from '../../bin/www';

async function sendresetpassword(name, email, token) {
  try {
    const transporter = await nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: 'For Reset Password',
      html: `Hii  ${name} Please Reset you password <a href="http://localhost:5050/users/reset-password?tokens=${token}"> reset your password</a>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email Has been sent: ', info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}

async function c_user(req, res, next) {
  try {
    let {
      first_name,
      last_name,
      email,
      dob,
      gender,
      weight,
      height,
      diseases,
      password,
      tokens,
      doctor,
    } = req.body;

    let user = await User.create({
      first_name,
      last_name,
      email,
      dob,
      gender,
      weight,
      height,
      diseases,
      password,
      tokens,
      doctor,
    });

    if (!user)
      return next(
        new APIError(ErrMessages.dataNotCreated, httpStatus.UNAUTHORIZED, true)
      );
    next(user);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function login_user(req, res, next) {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user)
      return next(
        new APIError(ErrMessages.dataNotFound, httpStatus.UNAUTHORIZED, true)
      );

    let pass = await bcrypts.compare(password, user.password);
    console.log(pass);
    if (!pass)
      return next(
        new APIError(ErrMessages.wrongPassword, httpStatus.UNAUTHORIZED, true)
      );

    let tkn = await jwt.sign(
      {
        userId: user._id,
      },
      jwtSecret
    );
    if (!tkn)
      return next(
        new APIError(ErrMessages.tokenNotCreated, httpStatus.UNAUTHORIZED, true)
      );

    let updateResult = await User.findOneAndUpdate(
      { email },
      {
        $push: {
          tokens: {
            $each: [tkn],
            $slice: -3,
          },
        },
      }
    );

    if (!updateResult)
      return next(
        new APIError(ErrMessages.tokenUpdate, httpStatus.UNAUTHORIZED, true)
      );

    return res.send({users:{_id:user._id}, tkn});
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function forget_password(req, res, next) {
  try {
    let email = req.body.email;
    let f_email = await User.findOne({ email });
    if (!f_email)
      return next(
        new APIError(ErrMessages.userNotFound, httpStatus.UNAUTHORIZED, true)
      );

    let tkn = await jwt.sign(
      {
        last_name: f_email.last_name,
      },
      secret
    );
    if (!tkn)
      return next(
        new APIError(ErrMessages.tokenNotCreated, httpStatus.UNAUTHORIZED, true)
      );

    let token_set = await User.updateOne({ email }, { $set: { tokens: tkn } });
    if (!token_set)
      return next(
        new APIError(ErrMessages.badToken, httpStatus.UNAUTHORIZED, true)
      );

    sendresetpassword(f_email.first_name, f_email.email, tkn);

    next(SuccessMessages.forgetPasswordSuccess);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function reset_password(req, res, next) {
  try {
    let tokens = req.query.tokens;
    let find_token = await User.findOne({ tokens });
    if (!find_token)
      return next(
        new APIError(ErrMessages.linkExpired, httpStatus.UNAUTHORIZED, true)
      );

    let pass = req.body.password;
    let password = await bcrypts.hash(pass, 10);
    let set_pass = await User.findByIdAndUpdate(
      { _id: find_token._id },
      { $set: { password, tokens: '' } }
    );
    if (!set_pass)
      return next(
        new APIError(ErrMessages.linkExpired, httpStatus.UNAUTHORIZED, true)
      );

    next(SuccessMessages.resetPasswordSuccess);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function chenge_password(req, res, next) {
  try {
    let { email, currentPassword, newPassword } = req.body;

    let users = await User.findOne({ email });
    console.log('user id', users._id);
    if (!users)
      return next(
        new APIError(ErrMessages.userNotFound, httpStatus.UNAUTHORIZED, true)
      );

    let isMatch = await bcrypts.compare(currentPassword, users.password);
    console.log(isMatch);

    if (!isMatch)
      return next(
        new APIError(ErrMessages.currentPassword, httpStatus.UNAUTHORIZED, true)
      );

    let np = await bcrypts.hash(newPassword, 12);
    let update = await User.findOneAndUpdate(
      { _id: users._id },
      { password: np }
    );

    if (!update)
      return next(
        new APIError(ErrMessages.update, httpStatus.UNAUTHORIZED, true)
      );

    // res.send({ message: "Password changed successfully!" });
    next(update);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

module.exports = {
  c_user,
  login_user,
  forget_password,
  reset_password,
  chenge_password,
};
