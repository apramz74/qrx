import QRCode from "qrcode";

export const generateQRCode = async (
  content,
  foregroundColor,
  backgroundColor
) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(content, {
      width: 256,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};
