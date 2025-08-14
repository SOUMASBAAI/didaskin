import { useState, useCallback } from "react";
import { uploadImageToCloudinary } from "../lib/cloudinary";

/**
 * Custom hook for handling image uploads to Cloudinary
 * @returns {Object} - Upload state and functions
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  /**
   * Upload a single image
   * @param {File} file - The image file to upload
   * @param {Object} options - Upload options
   * @returns {Promise<string>} - The uploaded image URL
   */
  const uploadImage = useCallback(async (file, options = {}) => {
    if (!file) {
      throw new Error("No file provided");
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate progress (Cloudinary doesn't provide upload progress via fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const imageUrl = await uploadImageToCloudinary(file, options);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploading(false);

      return imageUrl;
    } catch (error) {
      setUploadError(error.message);
      setUploading(false);
      setUploadProgress(0);
      throw error;
    }
  }, []);

  /**
   * Upload multiple images
   * @param {File[]} files - Array of image files to upload
   * @param {Object} options - Upload options
   * @returns {Promise<string[]>} - Array of uploaded image URLs
   */
  const uploadMultipleImages = useCallback(async (files, options = {}) => {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const uploadPromises = files.map((file) =>
        uploadImageToCloudinary(file, options)
      );
      const imageUrls = await Promise.all(uploadPromises);

      setUploading(false);
      setUploadProgress(100);

      return imageUrls;
    } catch (error) {
      setUploadError(error.message);
      setUploading(false);
      setUploadProgress(0);
      throw error;
    }
  }, []);

  /**
   * Reset upload state
   */
  const resetUploadState = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadError,
    uploadImage,
    uploadMultipleImages,
    resetUploadState,
  };
};
