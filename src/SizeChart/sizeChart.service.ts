import mongoose from "mongoose";
import { Size } from "../Size/size.model";
import { ISizeChart, SizeChart } from "./sizeChart.model";

export const createSizeChartService = async (data: Partial<ISizeChart>) => {
  const { name, description, rows } = data;

  // Validate rows
  if (!rows || rows.length === 0) {
    throw new Error("At least one size chart row is required");
  }

  // Check for duplicate sizes
  const sizeIds = rows.map((row) => row.size.toString());

  const uniqueSizeIds = new Set(sizeIds);

  if (uniqueSizeIds.size !== sizeIds.length) {
    throw new Error("Duplicate sizes are not allowed in a size chart");
  }

  // Validate ObjectIds
  const invalidSizeId = sizeIds.find(
    (id) => !mongoose.Types.ObjectId.isValid(id),
  );

  if (invalidSizeId) {
    throw new Error(`Invalid size ID: ${invalidSizeId}`);
  }

  // Check that all sizes exist
  const existingSizes = await Size.find({
    _id: { $in: sizeIds },
    status: { $ne: "deleted" },
  }).select("_id");

  if (existingSizes.length !== sizeIds.length) {
    throw new Error("One or more provided size IDs do not exist");
  }

  // Validate measurement ranges
  for (const row of rows) {
    if (row.height && row.height.max < row.height.min) {
      throw new Error("Height max must be greater than or equal to min");
    }

    if (row.chest && row.chest.max < row.chest.min) {
      throw new Error("Chest max must be greater than or equal to min");
    }

    if (row.waist && row.waist.max < row.waist.min) {
      throw new Error("Waist max must be greater than or equal to min");
    }
  }

  // Create size chart
  const sizeChart = await SizeChart.create({
    name,
    description,
    rows,
  });

  return sizeChart;
};

// Update Size Chart service function
export const updateSizeChartService = async (
  id: string,
  data: Partial<ISizeChart>,
) => {
  // Validate Size Chart ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid size chart ID");
  }

  // Check if size chart exists
  const existingSizeChart = await SizeChart.findById(id);

  if (!existingSizeChart) {
    throw new Error("Size chart not found");
  }

  // Validate rows only if rows are being updated
  if (data.rows !== undefined) {
    if (!Array.isArray(data.rows) || data.rows.length === 0) {
      throw new Error("At least one size chart row is required");
    }

    // Check for duplicate sizes
    const sizeIds = data.rows.map((row) => row.size.toString());

    const uniqueSizeIds = new Set(sizeIds);

    if (uniqueSizeIds.size !== sizeIds.length) {
      throw new Error("Duplicate sizes are not allowed in a size chart");
    }

    // Validate size ObjectIds
    const invalidSizeId = sizeIds.find(
      (sizeId) => !mongoose.Types.ObjectId.isValid(sizeId),
    );

    if (invalidSizeId) {
      throw new Error(`Invalid size ID: ${invalidSizeId}`);
    }

    // Check that all sizes exist
    const existingSizes = await Size.find({
      _id: { $in: sizeIds },
      status: { $ne: "deleted" },
    }).select("_id");

    if (existingSizes.length !== sizeIds.length) {
      throw new Error("One or more provided size IDs do not exist");
    }

    // Validate measurement ranges
    for (const row of data.rows) {
      if (row.height && row.height.max < row.height.min) {
        throw new Error("Height max must be greater than or equal to min");
      }

      if (row.chest && row.chest.max < row.chest.min) {
        throw new Error("Chest max must be greater than or equal to min");
      }

      if (row.waist && row.waist.max < row.waist.min) {
        throw new Error("Waist max must be greater than or equal to min");
      }
    }
  }

  // Update size chart
  const updatedSizeChart = await SizeChart.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedSizeChart) {
    throw new Error("Failed to update size chart");
  }

  return updatedSizeChart;
};

// Get all Size Charts service function
export const getAllSizeChartsService = async (
  keyword: string,
  offset: number,
  limit: number,
  status: string,
) => {
  const filter: Record<string, unknown> = {
    status: {
      $ne: "deleted",
    },
  };

  if (keyword?.trim()) {
    filter.name = {
      $regex: keyword.trim(),
      $options: "i",
    };
  }

  if (status?.trim()) {
    filter.status = status.trim();
  }

  const sizeCharts = await SizeChart.find(filter)
    .populate("rows.size")
    .skip(Number(offset))
    .limit(Number(limit))
    .sort({
      createdAt: -1,
    });

  const total = await SizeChart.countDocuments(filter);

  return { sizeCharts, total };
};

// Delete size chart service function
export const deleteSizeChartService = async (id: string) => {
  const deleteSizeChart = await SizeChart.findByIdAndUpdate(
    id,
    {
      status: "deleted",
    },
    { new: true },
  );

  if (!deleteSizeChart) {
    throw new Error("Size chart not found");
  }

  return deleteSizeChart;
};
