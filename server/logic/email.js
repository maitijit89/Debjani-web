import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const RECEIVER_EMAIL = process.env.CONTACT_RECEIVER || 'maitidebjit2@gmail.com';

export const sendContactEmail = async (contactData) => {
  const { name, email, message } = contactData;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials missing in .env');
    throw new Error('Email service is not configured. Please set EMAIL_USER and EMAIL_PASS.');
  }

  const mailOptions = {
    from: `"S.S. SK. SN Clinic" <${process.env.EMAIL_USER}>`,
    to: RECEIVER_EMAIL,
    subject: `New Contact Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; margin-top: 20px;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 30px;">Sent from S.S. SK. SN Clinic Website</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendBookingNotification = async (bookingData) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials missing in .env');
    return; // Don't throw here to avoid failing the booking itself
  }
  const { 
    patientName, 
    patientPhone, 
    patientAge, 
    patientSex, 
    patientAddress, 
    message,
    clinicLocation,
    appointmentDate,
    startTime,
    endTime,
    razorpayPaymentId,
    amountPaid
  } = bookingData;

  const mailOptions = {
    from: `"S.S. SK. SN Clinic" <${process.env.EMAIL_USER}>`,
    to: RECEIVER_EMAIL,
    subject: `New Appointment Booking: ${patientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">New Appointment Secured</h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e293b;">Appointment Details</h3>
          <p><strong>Clinic:</strong> ${clinicLocation}</p>
          <p><strong>Date:</strong> ${new Date(appointmentDate).toDateString()}</p>
          <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e293b;">Patient Information</h3>
          <p><strong>Name:</strong> ${patientName}</p>
          <p><strong>Phone:</strong> ${patientPhone}</p>
          <p><strong>Age:</strong> ${patientAge}</p>
          <p><strong>Sex:</strong> ${patientSex}</p>
          <p><strong>Address:</strong> ${patientAddress}</p>
        </div>

        ${message ? `
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p><strong>Message/Notes:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>` : ''}

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
          <p><strong>Payment Status:</strong> Captured</p>
          <p><strong>Amount Paid:</strong> ₹${amountPaid}</p>
          <p><strong>Transaction ID:</strong> ${razorpayPaymentId}</p>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-top: 30px;">Sent from S.S. SK. SN Clinic Website</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
