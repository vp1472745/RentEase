import FraudReport from '../models/fraud.js';
import { validationResult } from 'express-validator';

// Submit credit card fraud report
export const submitCreditCardFraud = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contactNumber, email, cardLastFour, amount, transactionDate, cardIssuerBank, transactionTime, additionalInfo } = req.body;

    // Create details string for credit card fraud
    const details = `Card Last Four: ${cardLastFour}, Amount: ₹${amount}, Date: ${transactionDate}, Bank: ${cardIssuerBank}, Time: ${transactionTime}, Additional Info: ${additionalInfo}`;

    const newReport = new FraudReport({
      name,
      contact: contactNumber,
      email,
      category: 'credit',
      details
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
      name,
      contact: contactNumber,
      email,
      category: 'other',
      details: fraudDetails
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

// Delete fraud report
export const deleteFraudReport = async (req, res) => {
  try {
    const report = await FraudReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Fraud report not found' });
    }

    res.status(200).json({ success: true, message: 'Fraud report deleted successfully' });
  } catch (error) {
    console.error('Error deleting fraud report:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};


