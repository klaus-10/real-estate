// import "dotenv/config";
// import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

// export const sendVerificationAccountEmail = async (
//   client_email: string,
//   client_name: string,
//   token: string
// ): Promise<void> => {
//   const mailerSend = new MailerSend({
//     apiKey: process.env.EMAIL_TOKEN,
//   });

//   const sentFrom = new Sender("info@info.com", "Test");

//   const recipients = [new Recipient(client_email, client_name)];

//   const emailParams = new EmailParams()
//     .setFrom(sentFrom)
//     .setTo(recipients)
//     .setReplyTo(sentFrom)
//     .setSubject("Verifica account richiesta")
//     .setHtml(
//       "<strong>Questo è il tuo codice di verifica dell'account.</strong>"
//     )
//     .setText(token);

//   await mailerSend.email.send(emailParams);
// };

const nodemailer = require("nodemailer");

export const sendVerificationAccountEmail = async (
  client_email: string,
  token: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.GOOGLE_USER_MAIL,
      pass: process.env.GOOGLE_MAIL_APP_PW,
    },
  });

  const mailOptions = {
    from: {
      name: "Game Cloud",
      address: process.env.USER,
    },
    to: client_email,
    subject: "Verifica account richiesta",
    text: token,
    html: `<strong>Questo è il tuo codice di verifica dell'account.</strong> <br><br><br> ${token}`,
  };

  await transporter.sendMail(mailOptions);
};
