import sgMail from "@sendgrid/mail";
import { injectable } from "inversify";
import { BaseError } from "../../domain/errors/BaseError";
import { EmailService } from "../../domain/interfaces/application interfaces/EmailService";

@injectable()
export class EmailServiceImpl implements EmailService {
  async sendEmail(data: {
    name: string;
    email: string;
    mobile: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    try {
      const { name, email, mobile, subject, message } = data;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

      const msg = {
        to: process.env.RECEIVER_EMAIL!,
        from: process.env.SENDER_EMAIL!,
        replyTo: {
          email: email,
          name: name,
        },
        subject: subject,
        text: `${message}\n\nName: ${name}\nMobile: ${mobile}`,
      };

      await sgMail.send(msg);

      const autoReplyMsg = {
        to: email,
        from: process.env.SENDER_EMAIL!,
        subject: "Thank you for contacting us!",
        text: `Hello ${name},\n\nThank you for reaching out. We have received your message and will get back to you soon.\n\nBest regards, Team Viao`, // Auto-reply message
      };

      await sgMail.send(autoReplyMsg);

      console.log("Email sent to both receiver and user.");
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new BaseError("Error sending email! Try again later.", 500);
    }
  }

  async sendOtp(email: string): Promise<string> {
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
      throw new BaseError('Error sending otp! Try again later.', 500);
    }
  }
}
