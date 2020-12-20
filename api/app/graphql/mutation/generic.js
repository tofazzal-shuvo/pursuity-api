import { catchFile, uploadToAws } from "../../utility";

export const SingleUpload = async (_, { file }) => {
  try {
    const uploadFile = await catchFile(file);
    const awsData = await uploadToAws(uploadFile);
    const { filename, mimetype, filesize } = uploadFile;
    return {
      filename,
      mimetype,
      filesize,
      success: true,
      imageLink: awsData.key,
    };
  } catch (error) {
    console.log("error", error);
    return {
      // message: error.message,
      success: false,
    };
  }
};
