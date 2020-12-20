// import config from "config";

export const forgetPassMailOptions = (email, token) => ({
  from: "hello@slashit.me",
  to: email,
  subject: "SendBox",
  html: `<div
      style="min-height: 40vh;text-align: center;color: #000000; display: table;width: 100%;"
    >
      <div
        style="display: table-cell; vertical-align: middle; text-align: center; width: 100%;"
      >
      <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Ffree-png-szuhq&psig=AOvVaw1s-7ypNPmXdkMIi2BBU9Lw&ust=1593489883630000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJCF1MqSpuoCFQAAAAAdAAAAABAD" 
      style="width: 50%, margin: auto"/>
        <p style="font-size: 18px;">
          You are requested to change your SendBox password. Please click here to
          change password
        </p>
        <a
          href=${process.env.FRONTEND_URL}/reset-password?security_code=${token}
          target="_blank"
          style="color: #000000;padding: 5px 20px;background-color: #FE0000; border: 2px solid #000000;font-size: 18px; font-weight: bold;"
        >
          Change Password
        </a>
      </div>
    </div>`,
});

export const emailVerifMailOptions = (email, token) => ({
  from: "hello@slashit.me",
  to: email,
  subject: "SendBox",
  html: `<div
      style="min-height: 40vh;text-align: center;color: #000000; display: table;width: 100%;"
    >
      <div
        style="display: table-cell; vertical-align: middle; text-align: center; width: 100%;"
      >
        <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Ffree-png-szuhq&psig=AOvVaw1s-7ypNPmXdkMIi2BBU9Lw&ust=1593489883630000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJCF1MqSpuoCFQAAAAAdAAAAABAD" 
            style="width: 50%, margin: auto"
        />
        <p style="font-size: 18px;">
          Thank you for being a part of SendBox. To verify your email
        </p>
        <a
          href=${process.env.FRONTEND_URL}/verify-email?security_code=${token}
          target="_blank"
          style="color: #000000;padding: 5px 20px;background-color: #FE0000; border: 2px solid #000000;font-size: 18px; font-weight: bold;"
        >
          Verify Email
        </a>
      </div>
    </div>`,
});


export const addUserOptions = (email, id) => ({
  from: "hello@slashit.me",
  to: email,
  subject: "SendBox",
  html: `<div
      style="min-height: 40vh;text-align: center;color: #000000; display: table;width: 100%;"
    >
      <div
        style="display: table-cell; vertical-align: middle; text-align: center; width: 100%;"
      >
        <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Ffree-png-szuhq&psig=AOvVaw1s-7ypNPmXdkMIi2BBU9Lw&ust=1593489883630000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJCF1MqSpuoCFQAAAAAdAAAAABAD" 
            style="width: 50%, margin: auto"
        />
        <p style="font-size: 18px;">
          You are added to SendBox. Please accept the invitation or ignore
        </p>
        <a
          href=${process.env.FRONTEND_URL}/complete-profile?id=${id}
          target="_blank"
          style="color: #000000;padding: 5px 20px;background-color: #FE0000; border: 2px solid #000000;font-size: 18px; font-weight: bold;"
        >
          Accept
        </a>
      </div>
    </div>`,
});