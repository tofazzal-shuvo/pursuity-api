import sendGrid from "@sendgrid/mail";
import { EmailModel } from "../models";

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

export const emailSender = async ({
  type,
  email,
  name,
  link,
  emailName,
  amount,
  orderId,
  shopperName,
}) => {
  const mailInfo = await EmailModel.findOne({ type });
  // if (!mailInfo)
  //   throw new CustomError(
  //     `${emailName} email hasn't set yet by admin.`,
  //     statusCode.INTERNAL_ERROR
  //   );

  link = process.env.FRONTEND_URL + link;

  let subject, heading, html;

  if (!emailSender && type === "SIGNUP") {
    subject = eval("Please verify your email");
    heading = eval("Email verification");
    html = heading + eval(`Please verify your email <a href="${link}">here</a>`);
  } else {
    subject = eval("`" + mailInfo?.subject + "`");
    heading = eval("`" + "<h2>" + mailInfo?.heading + "</h2>" + "`");
    html = heading + eval("`" + mailInfo?.body + "`");
  }

  const msg = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject,
    html,
  };
  sendGrid.send(msg);

  return;
};

export const StickerEmailSender = async (html) => {
  // console.log(html);
  const msg = {
    from: process.env.SMTP_EMAIL,
    to: "hello@slashit.me",
    subject: "Applied for sticker",
    html,
  };
  sendGrid.send(msg);
  return;
};
