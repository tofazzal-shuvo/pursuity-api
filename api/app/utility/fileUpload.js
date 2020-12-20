import { s3bucket } from "../constant/aws";

export const uploadToAws = (file) =>
  new Promise((resovle, reject) => {
    const params = {
      Bucket: "slashit",
      Key: file.filename,
      Body: file.buffers,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    s3bucket.upload(params, function (err, data) {
      if (err) reject(err);
      resovle(data);
    });
  });

export const catchFile = (file) =>
  new Promise(async (resovle, reject) => {
    const { filename, mimetype, createReadStream } = await file;
    let buffer = [];

    let stream = createReadStream();
    stream.on("data", (chunk) => buffer.push(chunk));

    stream.once("end", () => {
      let buffers = Buffer.concat(buffer);
      resovle({
        mimetype,
        buffers,
        filesize: buffers.length,
        filename:
          new Date().getUTCMilliseconds().toString() +
          "-" +
          Date.now() +
          "-" +
          filename.replace(/\s+/g, "-").toLowerCase(),
      });
    });
    stream.on("error", reject);
  });

export const businessScriptWriter = async (user) => {
  const jsCode = `function checkout({valueId, descId, apiKey}) {
    var amount =
      document.getElementById(valueId).value ||
      document.getElementById(valueId).innerText;
    var desc =
      document.getElementById(descId).value ||
      document.getElementById(descId).innerText;
    var obj = {
      id: apiKey,
      amount: amount,
      desc: desc,
      src: window.location.href,
    };
    var salt = "some string here";
    var data = btoa(JSON.stringify(obj));
    window.location.assign("https://ez-pm.herokuapp.com/pay-auth/" + data);
  }`;
  const file = {
    filename: `main.js`,
    buffers: Buffer.from(jsCode),
    mimetype: "application/javascript",
  };
  await uploadToAws(file);
  return;
};
