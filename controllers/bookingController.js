const Booking = require('../models/booking');
// const { calculateGST } = require('../utils/gstCalculator');
// const PDFDocument = require('pdfmake');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const htmlPdf = require('html-pdf');
const Joi = require('joi');

// Calculate GST for the booking amount
let calculateGST = (amount) => {
  const GST_RATE = 18;  // Example GST rate
  return (amount * GST_RATE) / 100;
};

// Create a new booking
let createBooking = async (req, res) => {
  const { name, totalAmount } = req.body;

  try {
       let userData = req.body;
        let validator = Joi.object({
          name: Joi.string().required().messages({ "*": `name is required` }),
          totalAmount: Joi.number().required().messages({ "*": `totalAmount is required` })
    
        });
    
        let { error } = validator.validate(userData);
        if (error) {
          return res.status(400).json({
            message: error.message
          });
        }
    // Calculate GST
    const gstAmount = calculateGST(totalAmount);
    
    // Create new booking with gstAmount
    const booking = new Booking({ 
      name, 
      totalAmount, 
      gstAmount 
    });

    // Save the booking to the database
    await booking.save();
    return res.status(200).json({
      message: 'Booking created successfully.',
      data : booking
    });

  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    })
  }
};

// Update booking status and GST payment status
let updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status, gstStatus } = req.body;

  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the status and GST payment status
    booking.status = status;
    booking.gstStatus = gstStatus;
    await booking.save();

    res.status(200).json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// // Generate a PDF Invoice for a booking
// let generateInvoice = async (req, res) => {
//   const { bookingId } = req.params;

//   try {
//     const booking = await Booking.findOne({_id: bookingId});
   

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Calculate the total amount including GST
//     const totalAmountWithGST = booking.totalAmount + booking.gstAmount;

//     // PDF document definition
//     const docDefinition = {
//       content: [
//         { text: 'GST Invoice', style: 'header' },
//         { text: `Invoice for Booking: ${booking.name}` },
//         `Booking Amount: ${booking.totalAmount}`,
//         `GST (18%): ${booking.gstAmount}`,
//         `Total Amount (Including GST): ${totalAmountWithGST}`,
//         `Booking Status: ${booking.status}`,
//         `GST Status: ${booking.gstStatus}`,
//       ],
//       styles: {
//         header: { fontSize: 18, bold: true },
//       },
//     };

//     // Create the PDF
//     const pdfDoc = PDFDocument.createPdfKitDocument(docDefinition);
//     const filePath = path.join(__dirname, '../public/invoices', `invoice_${bookingId}.pdf`);
//     const writeStream = fs.createWriteStream(filePath);

//     pdfDoc.pipe(writeStream);
//     pdfDoc.end();

//     writeStream.on('finish', () => {
//       res.status(200).json({
//         message: 'Invoice generated successfully',
//         filePath: `/invoices/invoice_${bookingId}.pdf`,
//       });
//     });
//   } catch (error) {
//     console.log('dfsdfsdaf', error);
//     return res.status(500).json({
//       message: "Server error"
//     });
//   }
// };
// let generateInvoice = async (req, res) => {
//   const { bookingId } = req.params;

//   try {
//     const booking = await Booking.findOne({_id: bookingId});
    
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Calculate the total amount including GST
//     const totalAmountWithGST = booking.totalAmount + booking.gstAmount;

//     // Create the PDF document
//     const doc = new PDFDocument();

//     // Set the output path for the generated PDF
//     const filePath = path.join(__dirname, '../public/invoices', `invoice_${bookingId}.pdf`);
//     const writeStream = fs.createWriteStream(filePath);

//     const invoiceNumber = Math.floor(Math.random() * 1000000);
//     // Pipe the PDF document to the write stream
//     doc.pipe(writeStream);

//     // Add content to the PDF
//     doc.fontSize(18).text('GST Invoice', { align: 'center', bold: true });
//     doc.moveDown(1);
//     doc.fontSize(14).text(`Invoice for Booking: ${booking.name}`);
//     doc.text(`Booking Amount: ${booking.totalAmount}`);
//     doc.text(`GST (18%): ${booking.gstAmount}`);
//     doc.text(`Total Amount (Including GST): ${totalAmountWithGST}`);
//     doc.text(`Booking Status: ${booking.status}`);
//     doc.text(`GST Status: ${booking.gstStatus}`);
//     doc.text(`GST invoice Number: ${invoiceNumber}`);
//     doc.text(`Invoice Date: ${booking.createdAt}`);

//     // End the document (close it)
//     doc.end();

//     // Respond when the PDF is written successfully
//     writeStream.on('finish', () => {
//       res.status(200).json({
//         message: 'Invoice generated successfully',
//         filePath: `/invoices/invoice_${bookingId}.pdf`,
//       });
//     });
//   } catch (error) {
//     console.log('Error:', error);
//     return res.status(500).json({
//       message: "Server error"
//     });
//   }
// };

let generateInvoice = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findOne({ _id: bookingId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Read the HTML template
    const templatePath = path.join(__dirname, '../invoiceTemplate/invoice.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders with dynamic data
    const invoiceNumber = Math.floor(Math.random() * 1000000);
    const totalAmountWithGST = booking.totalAmount + booking.gstAmount;

    htmlTemplate = htmlTemplate.replace('{{bookingName}}', booking.name)
                               .replace('{{bookingAmount}}', booking.totalAmount)
                               .replace('{{gstAmount}}', booking.gstAmount)
                               .replace('{{totalAmountWithGST}}', totalAmountWithGST)
                               .replace('{{gstStatus}}', booking.gstStatus)
                               .replace('{{invoiceNumber}}', invoiceNumber)
                               .replace('{{bookingStatus}}', booking.status)
                               .replace('{{invoiceDate}}', booking.createdAt.toISOString().split('T')[0]); // Format the date

    // Set the output path for the generated PDF
    const filePath = path.join(__dirname, '../public/invoices', `invoice_${bookingId}.pdf`);

    // Generate the PDF from the HTML
    htmlPdf.create(htmlTemplate, { format: 'A4' }).toFile(filePath, (err, result) => {
      if (err) {
        console.log('Error generating PDF:', err);
        return res.status(500).json({ message: "Error generating PDF" });
      }

      // Respond when the PDF is generated successfully
      res.status(200).json({
        message: 'Invoice generated successfully',
        filePath: `/invoices/invoice_${bookingId}.pdf`,
      });
    });

  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const getBooking = await Booking.find();
    if (getBooking) {
      return res.status(200).json({
        message: 'Booking data get all successfully.',
        data : getBooking
      });
    } else {
      return res.status(400).json({
        message: 'User data not found.'
      });
    }

  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const getBooking = await Booking.findOne({_id:req.params.id});
    if (!getBooking) {
      return res.status(400).json({
        message: 'User data not found.'
      });

    } else {
      return res.status(200).json({
        message: 'Booking data get successfully.',
        data: getBooking
      });
    }
  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { calculateGST, createBooking, updateBookingStatus, generateInvoice, getAllBookings, getBooking  };























// const Booking = require('../models/booking');
// const { calculateGST, generateInvoice } = require('./invoiceService');

// // Create a new booking and invoice
// const createBooking = async (req, res) => {
//   try {
//     const { name, totalAmount } = req.body;

//     // Calculate GST based on the total amount (e.g., 18%)
//     const gstAmount = calculateGST(totalAmount);

//     // Create a new booking document
//     const newBooking = new Booking({
//       name,
//       totalAmount,
//       gstAmount,
//     });

//     await newBooking.save();

//     // Generate invoice
//     const invoice = generateInvoice(newBooking);

//     res.status(201).json({
//       message: 'Booking created and invoice generated.',
//       invoice,
//       booking: newBooking,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Error creating booking', error: err });
//   }
// };

// module.exports = { createBooking };