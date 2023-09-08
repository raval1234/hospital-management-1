import express from 'express';
import validate from 'express-validation';
import roomParams from '../params/room.params';
import room from '../beans/room';
const router = express.Router();

router.post('/roomcre', validate(roomParams.room_create), room.c_room);
router.get('/roomavailable', room.room_available);

module.exports = router;
