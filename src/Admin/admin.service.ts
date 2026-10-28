import bcrypt from "bcryptjs";
import { Admin, IAdmin } from "./admin.model";
import { generateJWTToken } from "../utils/jwtToken";

// Register Admin service function
export const registerAdminService = async (data: Partial<IAdmin>) => {
  const { name, email, password, phone } = data;

  if (!email || !password || !name) {
    throw new Error("Name, email, and password are required");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if admin already exists with this email
  const existingAdmin = await Admin.findOne({
    email: normalizedEmail,
    status: { $ne: "deleted" },
  });
  if (existingAdmin) {
    throw new Error("Admin with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = new Admin({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    type: "admin",
  });

  await admin.save();

  return { message: "Admin created successfully" };
};

// Login Admin service function
export const loginAdminService = async (email: string, password: string) => {
  try {
    const admin = await Admin.findOne({
      email,
      status: { $ne: "deleted" },
    });
    if (!admin || !admin.password) {
      throw new Error("Invalid credentials or user is not admin");
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentails!");
    }

    // Generate JWT token
    const token = generateJWTToken(
      { _id: admin._id.toString(), type: admin.type },
      "365d",
    );

    const { password: _pw, ...adminData } = admin.toObject();
    return {
      token,
      admin: adminData,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to login admin");
  }
};

// Get My Profile
export const getAdminMyProfileService = async (adminId: string) => {
  return await Admin.findById(adminId).select("-password");
};

// Update profile
export const updateProfileService = async (
  id: string,
  data: Partial<IAdmin>,
) => {
  const admin = await Admin.findOneAndUpdate(
    {
      _id: id,
      status: { $ne: "deleted" },
    },
    data,
    { new: true, runValidators: true },
  ).select("-password");

  if (!admin) {
    throw new Error("Admin not found");
  }

  return admin;
};

// Reset Password service function
export const resetPasswordService = async (
  id: string,
  data: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  const { oldPassword, newPassword } = data;
  
  const admin = await Admin.findOne({
    _id: id,
    status: { $ne: "deleted" },
  });

  if (!admin || !admin.password) {
    throw new Error("Admin not found");
  }

  if (oldPassword) {
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      throw new Error("Incorrect current password");
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  admin.password = hashedPassword;
  await admin.save();

  return { message: "Password updated successfully" };
};
