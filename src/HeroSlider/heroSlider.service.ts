import { uploadToBunny } from "../utils/bunnyUploader";
import { HeroSlider, IHeroSlider } from "./heroSlider.model";

// Create hero slider service function
export const createHeroSliderService = async (
  data: Partial<IHeroSlider>,
  file: Express.Multer.File,
) => {
  const {
    title,
    subTitle,
    buttonLabel,
    buttonLink,
    status,
    order,
    startDate,
    endDate,
  } = data;

  // Bunny CDN file upload
  const uploadResponse = await uploadToBunny(file.path, file.filename, "hero");

  if (!uploadResponse) {
    throw new Error("Hero slider image upload failed");
  }

  const heroSlider = new HeroSlider({
    title,
    subTitle,
    image: uploadResponse.url,
    imageFileId: uploadResponse.fileName,
    buttonLabel,
    buttonLink,
    status: status || "active",
    order: order || 0,
    startDate,
    endDate,
  });

  await heroSlider.save();

  return heroSlider;
};

// Update hero slider service funtion
export const updateHeroSliderService = async (
  id: string,
  data: Partial<IHeroSlider>,
) => {
  const updatedHeroSlider = await HeroSlider.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updatedHeroSlider) {
    throw new Error("Hero slider not found");
  }

  return updatedHeroSlider;
};

// Get all hero slider service function
export const getAllHeroSlidersService = async (
  keyword: string,
  limit: number,
  offset: number,
  status?: string,
) => {
  const filter: Record<string, unknown> = {
    status: { $ne: "deleted" },
  };

  if (keyword?.trim()) {
    filter.title = {
      $regex: keyword.trim(),
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  const result = await HeroSlider.find(filter).skip(offset).limit(limit);
  const total = await HeroSlider.countDocuments(filter);

  return {
    result,
    total,
  };
};

// Delete hero slider service function
export const deleteHeroSliderService = async (id: string) => {
  const deletedHeroSlider = await HeroSlider.findByIdAndUpdate(
    id,
    {
      status: "deleted",
    },
    { new: true },
  );

  if (!deletedHeroSlider) {
    throw new Error("Hero slider not found");
  }

  return deletedHeroSlider;
};
