import sendGrid from "@sendgrid/mail";

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

export const forgetPasswordMailSender = async ({ email, token }) => {
  let link = process.env.FRONTEND_URL + "reset-password/" + token;
  let html = `You have requested to reset password. Please set a new password from <a href="${link}">here</a>`;

  const msg = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Reset password",
    html,
  };
  sendGrid.send(msg);
};

export const registerMailSender = async ({ email, token }) => {
  let link = process.env.FRONTEND_URL + "verify-email/" + token;
  let html = `You are most welcome to My Pursuity. Please verify you email by clicking <a href="${link}">here</a>`;
  console.log(process.env.SMTP_EMAIL);
  const msg = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Welcome email",
    html,
  };
  sendGrid.send(msg);
};

export const resendVeficationLinkMailSender = async ({ email, token }) => {
  let link = process.env.FRONTEND_URL + "verify-email/" + token;
  let html = `You are requested to resend email verification link. Please verify you email by clicking <a href="${link}">here</a>`;

  const msg = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Email verification",
    html,
  };
  sendGrid.send(msg);
};

export const changeEmailMailSender = async ({ email, token }) => {
  let link = process.env.FRONTEND_URL + "change-email/" + token;
  let html = `You are requested to change email. If you are interested to change email click <a href="${link}">here</a>. <br /> Otherwise you can ignore the email.`;
  const msg = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Email Change",
    html,
  };
  sendGrid.send(msg);
};
