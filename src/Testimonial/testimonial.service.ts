import { deletefromBunny, uploadToBunny } from "../utils/bunnyUploader";
import { Testimonial, ITestimonial } from "./testimonial.model";

// Create testimonial service function
export const createTestimonialService = async (
  data: Partial<ITestimonial>,
  file?: Express.Multer.File,
) => {
  const { customerName, customerRole, rating, status, review } = data;

  let uploadResponse;

  if (file) {
    uploadResponse = await uploadToBunny(
      file.path,
      file.filename,
      "testimonial",
    );

    if (!uploadResponse) {
      throw new Error("Testimonial image upload failed");
    }
  }

  const testimonial = new Testimonial({
    customerName,
    customerRole,
    rating: rating || 5,
    status: status || "active",
    review,
    image: uploadResponse?.url || "",
    imageFileId: uploadResponse?.fileName || "",
  });

  await testimonial.save();

  return testimonial;
};

// Update testimonial service function
export const updateTestimonialService = async (
  id: string,
  data: Partial<ITestimonial>,
  file?: Express.Multer.File,
) => {
  const existingTestimonial = await Testimonial.findById(id);

  if (!existingTestimonial) {
    throw new Error("Testimonial not found");
  }

  if (file) {
    const uploadResponse = await uploadToBunny(
      file.path,
      file.filename,
      "testimonial",
    );

    if (!uploadResponse) {
      throw new Error("Testimonial image upload failed");
    }

    if (existingTestimonial.imageFileId) {
      await deletefromBunny(existingTestimonial.imageFileId, "testimonial");
    }

    data.image = uploadResponse.url;
    data.imageFileId = uploadResponse.fileName;
  }

  const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updatedTestimonial) {
    throw new Error("Testimonial not found");
  }

  return updatedTestimonial;
};

// Get all testimonials service function
export const getAllTestimonialsService = async () => {
  const query: Record<string, any> = {
    status: { $ne: "deleted" },
  };

  const result = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .lean();
  const total = await Testimonial.countDocuments(query);

  return {
    result,
    total,
  };
};

// Delete testimonial service function
export const deleteTestimonialService = async (id: string) => {
  const deletedTestimonial = await Testimonial.findByIdAndUpdate(
    id,
    { status: "deleted" },
    { new: true },
  );

  if (!deletedTestimonial) {
    throw new Error("Testimonial not found");
  }

  return deletedTestimonial;
};
