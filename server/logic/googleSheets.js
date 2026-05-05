/* global process */
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

// Initialize auth - using service account credentials from env
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replaceAll(String.raw`\n`, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const appendToSheet = async (bookingData) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0];

    // Get current headers to check if they exist
    let headers = [];
    try {
      await sheet.loadHeaderRow();
      headers = sheet.headerValues;
    } catch (e) {
      // Header row is empty or not initialized
      headers = [];
    }

    const requiredHeaders = [
      'Booking ID', 
      'Patient Name', 
      'Phone', 
      'Age', 
      'Sex', 
      'Address', 
      'Message', 
      'Clinic', 
      'Date', 
      'Start Time', 
      'End Time', 
      'Booked At',
      'Razorpay Order ID',
      'Razorpay Payment ID'
    ];


    // If headers don't exist or are empty, set them
    if (!headers || headers.length === 0) {
      await sheet.setHeaderRow(requiredHeaders);
    }

    // Append the row
    await sheet.addRow({
      'Booking ID': bookingData._id ? bookingData._id.toString() : 'N/A',
      'Patient Name': bookingData.patientName,
      'Phone': bookingData.patientPhone,
      'Age': bookingData.patientAge,
      'Sex': bookingData.patientSex,
      'Address': bookingData.patientAddress,
      'Message': bookingData.message || '',
      'Clinic': bookingData.clinicLocation,
      'Date': bookingData.appointmentDate instanceof Date ? bookingData.appointmentDate.toISOString().split('T')[0] : bookingData.appointmentDate,
      'Start Time': bookingData.startTime,
      'End Time': bookingData.endTime,
      'Booked At': bookingData.createdAt instanceof Date ? bookingData.createdAt.toISOString() : new Date().toISOString(),
      'Razorpay Order ID': bookingData.razorpayOrderId || 'N/A',
      'Razorpay Payment ID': bookingData.razorpayPaymentId || 'N/A'
    });


    console.log(`Successfully appended booking (${bookingData.patientName}) to Google Sheet`);
  } catch (error) {
    console.error('Error appending to Google Sheet:', error.message);
  }
};

export const addSubscriberToSheet = async (email) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Look for a sheet named "Subscribers", or use the second sheet
    let sheet = doc.sheetsByTitle['Subscribers'];
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Subscribers', headerValues: ['Email', 'Subscribed At'] });
    }

    await sheet.addRow({
      'Email': email,
      'Subscribed At': new Date().toISOString()
    });

    console.log(`Successfully added subscriber (${email}) to Google Sheet`);
  } catch (error) {
    console.error('Error adding subscriber to Google Sheet:', error.message);
  }
};

export const getAllSubscribers = async () => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Subscribers'];
    if (!sheet) return [];
    const rows = await sheet.getRows();
    return rows.map(row => row.get('Email'));
  } catch (error) {
    console.error('Error fetching subscribers:', error.message);
    return [];
  }
};
