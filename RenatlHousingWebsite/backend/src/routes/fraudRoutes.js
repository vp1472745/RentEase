import express from 'express';
import { submitCreditCardFraud, submitOtherFraud, getAllFraudReports, getFraudReportById, updateFraudReportStatus } from '../controller/fraudController.js';

const router = express.Router();

router.post('/report/credit-card', submitCreditCardFraud);
router.post('/report/other', submitOtherFraud);
router.get('/reports', getAllFraudReports);
router.get('/report/:id', getFraudReportById);
router.put('/report/:id', updateFraudReportStatus);

export default router;
