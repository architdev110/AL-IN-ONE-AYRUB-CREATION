import logger from '../config/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GENERATE INVOICE
export const generateInvoice = asyncHandler(async (req, res) => {
  try {
    const { clientName, items, taxRate = 0 } = req.body;

    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.quantity * item.price;
    });

    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    res.json({
      status: 'success',
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        clientName,
        items,
        subtotal,
        tax,
        total,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    logger.error(`Invoice generation error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate invoice'
    });
  }
});

// GENERATE QR CODE
export const generateQRCode = asyncHandler(async (req, res) => {
  try {
    const { data } = req.body;
    const QRCode = require('qrcode');

    const qrCodeDataUrl = await QRCode.toDataURL(data);

    res.json({
      status: 'success',
      data: {
        qrCode: qrCodeDataUrl,
        data
      }
    });
  } catch (error) {
    logger.error(`QR code generation error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate QR code'
    });
  }
});

// SHORTEN URL
export const shortenURL = asyncHandler(async (req, res) => {
  try {
    const { longUrl } = req.body;
    const shortCode = Math.random().toString(36).substring(7);

    res.json({
      status: 'success',
      data: {
        shortUrl: `https://ayrub.short/${shortCode}`,
        longUrl,
        shortCode
      }
    });
  } catch (error) {
    logger.error(`URL shortening error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to shorten URL'
    });
  }
});

// CONVERT PDF
export const convertPDF = asyncHandler(async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'PDF conversion initiated'
    });
  } catch (error) {
    logger.error(`PDF conversion error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to convert PDF'
    });
  }
});

// GENERATE COVER LETTER
export const generateCoverLetter = asyncHandler(async (req, res) => {
  try {
    const { jobTitle, company, skills } = req.body;

    const template = `
Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. 
With my expertise in ${skills.join(', ')}, I am confident I can contribute significantly to your team.

[Additional content would be generated here]

Best regards
    `;

    res.json({
      status: 'success',
      data: {
        coverLetter: template,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    logger.error(`Cover letter generation error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate cover letter'
    });
  }
});

// GENERATE ASSIGNMENT
export const generateAssignment = asyncHandler(async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    res.json({
      status: 'success',
      data: {
        assignment: {
          title: `${topic} Assignment (${difficulty})`,
          questions: [
            `Question 1 about ${topic}`,
            `Question 2 about ${topic}`,
            `Question 3 about ${topic}`
          ],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
  } catch (error) {
    logger.error(`Assignment generation error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate assignment'
    });
  }
});

// CALCULATE GPA
export const calculateGPA = asyncHandler(async (req, res) => {
  try {
    const { courses } = req.body;

    let totalGradePoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const gradePoints = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
      };
      
      totalGradePoints += (gradePoints[course.grade] || 0) * course.credits;
      totalCredits += course.credits;
    });

    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    res.json({
      status: 'success',
      data: {
        gpa,
        courses,
        totalCredits
      }
    });
  } catch (error) {
    logger.error(`GPA calculation error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to calculate GPA'
    });
  }
});

// TRACK EXPENSE
export const trackExpense = asyncHandler(async (req, res) => {
  try {
    const { category, amount, description } = req.body;

    res.json({
      status: 'success',
      data: {
        expense: {
          id: Math.random().toString(36).substr(2, 9),
          category,
          amount,
          description,
          date: new Date()
        }
      }
    });
  } catch (error) {
    logger.error(`Expense tracking error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to track expense'
    });
  }
});

// CREATE NOTE
export const createNote = asyncHandler(async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user.id;

    res.json({
      status: 'success',
      data: {
        note: {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          title,
          content,
          tags,
          createdAt: new Date()
        }
      }
    });
  } catch (error) {
    logger.error(`Note creation error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create note'
    });
  }
});
