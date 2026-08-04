const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Email transporter configuration helper
async function getTransporter() {
  // If credentials are provided in .env, use them
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Create test account on Ethereal Mail for sandbox testing
  console.log("No SMTP credentials found in .env. Creating an Ethereal test account...");
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// 1. Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: `"${firstName} ${lastName || ''}" <${email}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL || 'info@shoshonecountyshootingrange.org',
      subject: `New Inquiry from ${firstName} ${lastName || ''}`,
      text: message,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName || ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Message sent: %s', info.messageId);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
    }

    res.json({ 
      success: true, 
      message: 'Inquiry submitted successfully!',
      previewUrl: previewUrl || null 
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
});

// 2. Event Signup Endpoint
app.post('/api/signup', async (req, res) => {
  const { eventId, eventTitle, eventDate, name, email, phone, notes } = req.body;

  if (!eventId || !eventTitle || !name || !email) {
    return res.status(400).json({ success: false, error: 'Please provide all required fields.' });
  }

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: '"Shooting Range Calendar" <noreply@shoshonecountyshootingrange.org>',
      to: process.env.CONTACT_RECEIVER_EMAIL || 'info@shoshonecountyshootingrange.org',
      subject: `New Signup: ${eventTitle} (${eventDate})`,
      text: `Registration details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nNotes: ${notes || 'None'}`,
      html: `
        <h3>Event Registration Alert</h3>
        <p><strong>Event:</strong> ${eventTitle} (ID: ${eventId})</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <hr />
        <p><strong>Attendee Name:</strong> ${name}</p>
        <p><strong>Attendee Email:</strong> ${email}</p>
        <p><strong>Attendee Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Notes:</strong> ${notes || 'None'}</p>
      `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Signup notification sent: %s', info.messageId);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
    }

    res.json({ 
      success: true, 
      message: `Successfully registered for ${eventTitle}!`,
      previewUrl: previewUrl || null
    });
  } catch (error) {
    console.error('Error processing event signup email:', error);
    res.status(500).json({ success: false, error: 'Failed to complete registration. Please try again later.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
