import axios from "axios";
import fs from "fs";
import path from "path";

const { BH_CDN_STORAGE, BH_CDN_ACCESS, BH_CDN_LINK } = process.env;

const getDateTimeFileName = (originalName: string) => {
  const timestamp = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalName);
  return `${timestamp}${ext}`;
};

export const uploadToBunny = async (
  filePath: string,
  originalFileName: string,
  folder: string = "category",
): Promise<{ url: string; fileName: string }> => {
  const uniqueFileName = getDateTimeFileName(originalFileName);
  const uploadUrl = `${BH_CDN_STORAGE}${folder}/${uniqueFileName}`;
  const fileData = fs.readFileSync(filePath);
  try {
    await axios.put(uploadUrl, fileData, {
      headers: {
        AccessKey: BH_CDN_ACCESS!,
        "Content-Type": "application/octet-stream",
      },
    });
    return {
      url: `${BH_CDN_LINK}${folder}/${uniqueFileName}`,
      fileName: uniqueFileName,
    };
  } catch (error: any) {
    console.error(
      "Upload failed:",
      error.response?.status,
      error.response?.data,
    );
    throw new Error("BunnyCDN upload failed");
  }
};
export const deletefromBunny = async (fileName: string, folder: string) => {
  const deleteUrl = `${BH_CDN_STORAGE}${folder}/${fileName}`;
  try {
    const response = await axios.delete(deleteUrl, {
      headers: {
        AccessKey: BH_CDN_ACCESS!,
        "Content-Type": "application/octet-stream",
      },
    });
    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      "Delete failed:",
      error.response?.status,
      error.response?.data,
    );
  }
};
