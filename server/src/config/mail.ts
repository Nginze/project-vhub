import Mailgun from "mailgun.js";
import * as FormData from "form-data";

type MailConfig = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const mailgun = new Mailgun(FormData as any);

export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY as string,
});

export const sendMail = async (config: MailConfig) => {
  try {
    mg.messages.create("mail.holoverse.me", {
      from: "Mail <mailgun@mail.holoverse.me>",
      to: [config.to],
      subject: config.subject,
      text: config.text,
      html: "<h1>Testing some Mailgun awesomeness!</h1>",
    });
  } catch (error) {
    console.log(error);
  }
};
