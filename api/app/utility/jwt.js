import { verify } from "jsonwebtoken";

export const jwtDecode = (token) => {
  if (!token) return null;
  try {
    const decode = verify(token, "screateKey");
    return decode;
  } catch (err) {
    return null;
  }
};
