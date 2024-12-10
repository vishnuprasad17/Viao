import sgMail from '@sendgrid/mail';

export default async function generateOtp(email: string) {
  try {
    const otpCode: string = Math.floor(1000 + Math.random() * 9000).toString();

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg = {
      to: email, // recipient
      from: {
        email: process.env.FROM_EMAIL!, // sender email
        name: 'Viao', // sender name
      },
      subject: 'Verification Code',
      text: `Your OTP code is: ${otpCode}`,
    };

    // Send the email
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return otpCode;
  } catch (error) {
    console.error('Error sending email:', error);
  }
}