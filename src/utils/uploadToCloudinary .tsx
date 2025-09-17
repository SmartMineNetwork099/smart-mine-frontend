import axios, { AxiosError } from "axios";

const API_CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL as string;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  if (!API_CLOUDINARY_URL) {
    throw new Error("❌ Cloudinary URL missing. Check .env.local file!");
  }

  console.log("🔗 Using Cloudinary URL:", API_CLOUDINARY_URL);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "earning");

  try {
    const res = await axios.post("https://api.cloudinary.com/v1_1/dqjoxrhcp/image/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Cloudinary Response:", res.data);

    return res.data.secure_url;
  } catch (err) {
    const error = err as AxiosError<{ message: string , error?: { message: string } }>;
    console.error("❌ Cloudinary Upload Failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "Upload failed");
  }
};
