import { supabase } from "./supabaseClient";

const createQRCode = async (qrData) => {
  try {
    const { data, error } = await supabase
      .from("qr_codes")
      .insert({ qr_data: qrData })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving QR code to database:", error);
    throw error;
  }
};
