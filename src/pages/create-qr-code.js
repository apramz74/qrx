import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { generateQRCode } from "../utils/qrCodeGenerator";

export default function CreateQRCode() {
  const [url, setUrl] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insert the new QR code into the database
      const { data, error } = await supabase
        .from("qr_codes")
        .insert({ original_url: url })
        .select();

      if (error) throw error;

      const qrCodeId = data[0].id;

      // Generate the QR code
      const qrCodeDataUrl = await generateQRCode(qrCodeId, url);
      setQrCodeImage(qrCodeDataUrl);
    } catch (error) {
      console.error("Error creating QR code:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <button type="submit">Generate QR Code</button>
      </form>
      {qrCodeImage && <img src={qrCodeImage} alt="Generated QR Code" />}
    </div>
  );
}
