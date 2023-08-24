import Room from '../../server/models/room';
import APIError from '../helpers/APIError';

async function c_room(req, res, next) {
  try {
    let { name, available } = req.body;

    let rooms = await Room.create({
      name,
      available,
    });

    if (!rooms) return res.status(400).send('Room data not create');

    next(rooms);
    // res.status(200).json({rooms});
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

async function room_available(req, res, next) {
  try {
    let rooms = await Room.find({ available: { $eq: false } }).select('name');

    if (!rooms) return res.status(400).send('Room data not create');

    next(rooms);
    // res.status(200).json({rooms});
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
}

module.exports = {
  c_room,
  room_available,
};
