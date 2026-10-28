import { Address, IAddress } from "./address.model";

// Create address service function
export const createAddressService = async (data: Partial<IAddress>) => {
  const {
    user,
    addressType,
    name,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pinCode,
    isDefault,
  } = data;

  if (!user) {
    throw new Error("User ID is required");
  }

  // Check existing active addresses count for this user
  const existingCount = await Address.countDocuments({
    user,
    status: { $ne: "deleted" },
  });

  // If this is the user's first address or isDefault is true, set as default
  const shouldBeDefault = Boolean(isDefault || existingCount === 0);

  // If setting this address as default, unset previous default addresses
  if (shouldBeDefault) {
    await Address.updateMany(
      { user, status: { $ne: "deleted" } },
      { isDefault: false },
    );
  }

  const address = new Address({
    user,
    addressType: addressType || "home",
    name,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pinCode,
    isDefault: shouldBeDefault,
  });

  await address.save();

  return address;
};

// Update address service function
export const updateAddressService = async (
  id: string,
  data: Partial<IAddress>,
  userId?: string,
) => {
  const filter: Record<string, any> = {
    _id: id,
    status: { $ne: "deleted" },
  };
  if (userId) {
    filter.user = userId;
  }

  const existingAddress = await Address.findOne(filter);

  if (!existingAddress) {
    throw new Error("Address not found");
  }

  // If updating to default, unset previous default addresses
  if (data.isDefault) {
    await Address.updateMany(
      {
        user: existingAddress.user,
        _id: { $ne: id },
        status: { $ne: "deleted" },
      },
      { isDefault: false },
    );
  }

  const updatedAddress = await Address.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedAddress) {
    throw new Error("Address not found");
  }

  return updatedAddress;
};

// Get all addresses for a specific user service function
export const getUserAddressesService = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const addresses = await Address.find({
    user: userId,
    status: { $ne: "deleted" },
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return addresses;
};

// Delete address service function (soft delete)
export const deleteAddressService = async (id: string, userId?: string) => {
  const filter: Record<string, any> = {
    _id: id,
    status: { $ne: "deleted" },
  };
  if (userId) {
    filter.user = userId;
  }

  const existingAddress = await Address.findOne(filter);

  if (!existingAddress) {
    throw new Error("Address not found");
  }

  const deletedAddress = await Address.findByIdAndUpdate(
    id,
    {
      status: "deleted",
      isDefault: false,
    },
    { new: true },
  );

  // If the deleted address was default, set the latest remaining address as default
  if (existingAddress.isDefault) {
    const nextAddress = await Address.findOne({
      user: existingAddress.user,
      status: { $ne: "deleted" },
    }).sort({ createdAt: -1 });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return deletedAddress;
};
