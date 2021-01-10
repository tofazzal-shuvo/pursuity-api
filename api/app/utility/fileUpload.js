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
