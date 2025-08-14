import {
  CLOUDINARY_CONFIG,
  DEFAULT_UPLOAD_OPTIONS,
  IMAGE_TRANSFORMS,
} from "../config/cloudinary.js";

/**
 * Upload an image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Object} options - Additional upload options
 * @returns {Promise<string>} - The uploaded image URL
 */
export const uploadImageToCloudinary = async (file, options = {}) => {
  // Validate configuration
  if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
    throw new Error(
      "Cloudinary configuration missing. Please check your environment variables."
    );
  }

  // Validate file
  if (!file) {
    throw new Error("No file provided");
  }

  // Check file size
  if (file.size > DEFAULT_UPLOAD_OPTIONS.maxFileSize) {
    throw new Error(
      `File size exceeds maximum allowed size of ${
        DEFAULT_UPLOAD_OPTIONS.maxFileSize / (1024 * 1024)
      }MB`
    );
  }

  // Check file format
  const fileExtension = file.name.split(".").pop().toLowerCase();
  if (!DEFAULT_UPLOAD_OPTIONS.allowedFormats.includes(fileExtension)) {
    throw new Error(
      `File format not supported. Allowed formats: ${DEFAULT_UPLOAD_OPTIONS.allowedFormats.join(
        ", "
      )}`
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName);

  // Add folder if specified
  if (DEFAULT_UPLOAD_OPTIONS.folder) {
    formData.append("folder", DEFAULT_UPLOAD_OPTIONS.folder);
  }

  // Add custom options
  if (options.folder) {
    formData.append("folder", options.folder);
  }
  if (options.public_id) {
    formData.append("public_id", options.public_id);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Upload failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary (if you have admin API access)
 * @param {string} publicId - The public ID of the image
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImageFromCloudinary = async (publicId) => {
  // Note: This requires admin API access and should be implemented on the backend
  // for security reasons
  console.warn("Image deletion should be handled on the backend for security");
  return false;
};

/**
 * Generate a Cloudinary URL with transformations
 * @param {string} imageUrl - The original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getTransformedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
    return imageUrl;
  }

  const baseUrl = imageUrl.split("/upload/")[0] + "/upload/";
  const imagePath = imageUrl.split("/upload/")[1];

  // Build transformation string
  let transformations = "";
  if (options.width) transformations += `w_${options.width},`;
  if (options.height) transformations += `h_${options.height},`;
  if (options.crop) transformations += `c_${options.crop},`;
  if (options.quality) transformations += `q_${options.quality},`;
  if (options.format) transformations += `f_${options.format},`;

  // Remove trailing comma
  if (transformations.endsWith(",")) {
    transformations = transformations.slice(0, -1);
  }

  return `${baseUrl}${transformations}/${imagePath}`;
};

/**
 * Get a transformed image URL using predefined presets
 * @param {string} imageUrl - The original Cloudinary URL
 * @param {string} preset - The preset name (thumbnail, medium, large)
 * @returns {string} - Transformed image URL
 */
export const getPresetImageUrl = (imageUrl, preset = "medium") => {
  const transformOptions = IMAGE_TRANSFORMS[preset];
  if (!transformOptions) {
    console.warn(`Unknown preset: ${preset}. Using original URL.`);
    return imageUrl;
  }

  return getTransformedImageUrl(imageUrl, transformOptions);
};

/**
 * Check if a URL is a Cloudinary URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return url && url.includes("cloudinary.com");
};

/**
 * Extract public ID from a Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not a Cloudinary URL
 */
export const getPublicIdFromUrl = (url) => {
  if (!isCloudinaryUrl(url)) {
    return null;
  }

  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1 || uploadIndex + 1 >= urlParts.length) {
      return null;
    }

    // Remove file extension
    const publicIdWithExt = urlParts.slice(uploadIndex + 1).join("/");
    const publicId = publicIdWithExt.split(".")[0];
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};
