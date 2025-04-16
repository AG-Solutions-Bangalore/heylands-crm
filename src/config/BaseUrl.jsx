const BASE_URL = "https://agsdemo.in/otherapi/public";
export default BASE_URL;

export const API_URL = "https://exportbiz.in";
export const SIGN_IN_PURCHASE =
  "https://agsdemo.in/otherapi/public/assets/images/sign";
export const LetterHead =
  "https://agsdemo.in/otherapi/public/assets/images/letterHead";

export const LetterHeadPdf = "https://test.exportbiz.in/letterHead";
export const signPdf = "https://test.exportbiz.in/sign";
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  return `https://agsdemo.in/otherapi/public/assets/images/letterHead/${imagePath}`;
};
export const getSignUrl = (imagePath) => {
  if (!imagePath) return "";
  return `https://agsdemo.in/otherapi/public/assets/images/sign/${imagePath}`;
};
