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

export const sendWelcomeEmail = async (email) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials missing in .env');
    throw new Error('Email service is not configured.');
  }

  const mailOptions = {
    from: `"S.S. SK. SN Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to S.S. SK. SN Clinic Newsletter!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <div style="background-color: #0ea5e9; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Welcome to Our Clinic</h1>
        </div>
        <div style="padding: 40px; background-color: white;">
          <h2 style="color: #1e293b; margin-top: 0;">Thank you for subscribing!</h2>
          <p style="color: #475569; line-height: 1.6; font-size: 16px;">
            We are thrilled to have you as part of our community. You'll now be the first to receive:
          </p>
          <ul style="color: #475569; line-height: 1.8; font-size: 16px;">
            <li>Exclusive health tips and wellness advice.</li>
            <li>Important updates about our clinic services.</li>
            <li>Advanced information on modern genetic homeopathy.</li>
          </ul>
          <div style="margin-top: 40px; text-align: center;">
            <a href="https://debjaniclinic.com" style="background-color: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Visit Our Website</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; text-align: center;">
            If you have any questions, feel free to reply to this email.
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">&copy; 2026 S.S. SK. SN Clinic. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
