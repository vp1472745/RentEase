// import FraudReport from '../models/fraud.js';
import { validationResult } from 'express-validator';

// Submit credit card fraud report
export const submitCreditCardFraud = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contactNumber, email, cardLastFour, amount, transactionDate, cardIssuerBank, transactionTime, additionalInfo } = req.body;

    const newReport = new FraudReport({
      type: 'credit_card',
      reporterDetails: { name, contactNumber, email },
      fraudDetails: { cardLastFour, amount: parseFloat(amount), transactionDate: new Date(transactionDate), cardIssuerBank, transactionTime, additionalInfo },
      status: 'submitted',
      submittedAt: new Date()
    });

    await newReport.save();
    
    res.status(201).json({ success: true, message: 'Credit card fraud report submitted successfully', reportId: newReport._id });
  } catch (error) {
    console.error('Error submitting credit card fraud report:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Submit other type of fraud report
export const submitOtherFraud = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contactNumber, email, fraudDetails } = req.body;

    const newReport = new FraudReport({
      type: 'other',
      reporterDetails: { name, contactNumber, email },
      fraudDetails: { description: fraudDetails },
      status: 'submitted',
      submittedAt: new Date()
    });

    await newReport.save();
    
    res.status(201).json({ success: true, message: 'Fraud report submitted successfully', reportId: newReport._id });
  } catch (error) {
    console.error('Error submitting fraud report:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get all fraud reports
export const getAllFraudReports = async (req, res) => {
  try {
    const reports = await FraudReport.find().sort({ submittedAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('Error fetching fraud reports:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get fraud report by ID
export const getFraudReportById = async (req, res) => {
  try {
    const report = await FraudReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Fraud report not found' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching fraud report:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Update fraud report status
export const updateFraudReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await FraudReport.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Fraud report not found' });
    }

    res.status(200).json({ success: true, message: 'Fraud report status updated', data: report });
  } catch (error) {
    console.error('Error updating fraud report:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
