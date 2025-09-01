// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName:"dl6gb7cwm",
  uploadPreset:
  "didaskin",
  apiKey:"755615669618279" ,
};

// Default upload options
export const DEFAULT_UPLOAD_OPTIONS = {
  folder: "didaskin", // Optional: organize images in a folder
  allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
  maxFileSize: 10 * 1024 * 1024, // 10MB
};
// Folder structure for different content types
export const FOLDER_STRUCTURE = {
  categories: "didaskin/categories",
  subcategories: "didaskin/subcategories",
  services: "didaskin/services",
  products: "didaskin/products",
  users: "didaskin/users",
};
// Image transformation presets
export const IMAGE_TRANSFORMS = {
  thumbnail: { width: 150, height: 150, crop: "fill", quality: 80 },
  medium: { width: 300, height: 300, crop: "fill", quality: 85 },
  large: { width: 800, height: 800, crop: "limit", quality: 90 },
};
