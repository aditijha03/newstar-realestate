import { Router, Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry';

const router = Router();

const INTEREST_LABELS: Record<string, string> = {
  buying: 'Buying a Property',
  renting: 'Renting / Lease',
  selling: 'Selling a Property',
  investment: 'Investment Consultation',
  other: 'Other',
};

// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  const { name, phone, email, interest, message } = req.body;

  // Basic validation
  if (!name || !phone || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const interestLabel = INTEREST_LABELS[interest] || interest || 'Not specified';

  try {
    // 1. Save to Database
    const enquiry = new Enquiry({
      name,
      phone,
      email,
      message,
      status: 'New',
      // We don't have a specific property linked for general contact, so we leave propertyId null
      // But we can use propertyTitle to store the interest type for easier viewing in admin
      propertyTitle: `General Enquiry: ${interestLabel}` 
    });
    await enquiry.save();

    // 2. Send Email via EmailJS REST API
    // Using the keys provided by the user
    const emailJsPayload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        name,
        phone,
        email,
        interest: interestLabel,
        message
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailJsPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('EmailJS error:', errText);
      return res.status(500).json({ success: false, message: 'Failed to send email notification. Please try again.' });
    }

    return res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });

  } catch (error) {
    console.error('Contact route error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

export default router;