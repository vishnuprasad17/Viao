import nodemailer from "nodemailer";
import { injectable } from "inversify";
import { BaseError } from "../../domain/errors/BaseError";
import { EmailService } from "../../domain/interfaces/application interfaces/EmailService";

@injectable()
export class EmailServiceImpl implements EmailService {
    private transporter: nodemailer.Transporter | null = null;

    private getTransporter(): nodemailer.Transporter {
        if (this.transporter) return this.transporter;

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER!,
                pass: process.env.EMAIL_PASSWORD!,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        return this.transporter;
    }

    async sendEmail(data: {
        name: string;
        email: string;
        mobile: string;
        subject: string;
        message: string;
    }): Promise<boolean> {
        const { name, email, mobile, subject, message } = data;
        const transporter = this.getTransporter();

        try {
            await transporter.sendMail({
                from: `"Viao Contact" <${process.env.SENDER_EMAIL!}>`,
                to: process.env.EMAIL_USER!,
                replyTo: `"${name}" <${email}>`,
                subject: subject,
                text: `${message}\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">New Contact Message</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Mobile:</strong> ${mobile}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <hr />
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                    </div>
                `,
            });

            await transporter.sendMail({
                from: `"Team Viao" <${process.env.EMAIL_USER!}>`,
                to: email,
                subject: "Thank you for contacting us!",
                text: `Hello ${name},\n\nThank you for reaching out. We have received your message and will get back to you soon.\n\nBest regards,\nTeam Viao`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Thank you for contacting us!</h2>
                        <p>Hello <strong>${name}</strong>,</p>
                        <p>Thank you for reaching out. We have received your message and will get back to you soon.</p>
                        <br />
                        <p>Best regards,</p>
                        <p><strong>Team Viao</strong></p>
                    </div>
                `,
            });

            console.log("Email sent to both receiver and user.");
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            throw new BaseError("Error sending email! Try again later.", 500);
        }
    }

    async sendOtp(email: string): Promise<string> {
        const otpCode: string = Math.floor(100000 + Math.random() * 900000).toString();
        const transporter = this.getTransporter();

        try {
            await transporter.sendMail({
                from: `"Viao" <${process.env.EMAIL_USER!}>`,
                to: email,
                subject: "Your Verification Code",
                text: `Your OTP code is: ${otpCode}\n\nThis code expires in 2 minutes. Do not share it with anyone.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Verification Code</h2>
                        <p>Use the OTP below to complete your verification. It expires in <strong>2 minutes</strong>.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="
                                font-size: 36px;
                                font-weight: bold;
                                letter-spacing: 8px;
                                color: #1a73e8;
                                background: #f0f4ff;
                                padding: 16px 32px;
                                border-radius: 8px;
                                display: inline-block;
                            ">${otpCode}</span>
                        </div>
                        <p style="color: #888; font-size: 13px;">If you did not request this, please ignore this email.</p>
                    </div>
                `,
            });

            console.log(`OTP sent successfully to ${email}`);
            return otpCode;
        } catch (error) {
            console.error("Error sending OTP email:", error);
            throw new BaseError("Error sending OTP! Try again later.", 500);
        }
    }
}