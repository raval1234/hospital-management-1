import express from 'express';
import validate from 'express-validation';
import paginationParams from '../params/pagination.params';
import control_pagination from'../beans/pagination';
const router = express.Router();


router.get('/pagination',validate(paginationParams.pagination) , control_pagination.pagination);


module.exports = router;
