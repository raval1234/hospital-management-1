import express from 'express';
import appointmentRoutes from './appointment.route';
import hospitalRoutes from './hospital.route';
import doctorRoutes from './doctors.route';
import patientRoutes from './patient.route';
import roomRouter from './room.route';
import paginationRouter from './pagination.route';
import userRouter from './users.route';


const router = express.Router();
// router.use(authorize);

// router.use(authorize);
/* authorized routes APIs */
router.use('/appointment', appointmentRoutes);
router.use('/hospital', hospitalRoutes);
router.use('/doctor',doctorRoutes);
router.use('/patient',patientRoutes);
router.use('/room',roomRouter);
router.use('/pagination',paginationRouter);
router.use('/users',userRouter);

module.exports = router;

