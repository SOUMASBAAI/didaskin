import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useImageUpload } from "../../hooks/useImageUpload";

/**
 * ImageUpload component for handling image uploads to Cloudinary
 * @param {Object} props - Component props
 * @param {string} props.value - Current image URL
 * @param {Function} props.onChange - Callback when image changes
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.uploadOptions - Cloudinary upload options
 * @param {boolean} props.showPreview - Whether to show image preview
 * @param {string} props.accept - Accepted file types
 * @param {number} props.maxSize - Maximum file size in MB
 */
export default function ImageUpload({
  value = "",
  onChange,
  placeholder = "Drop an image or click to browse",
  className = "",
  uploadOptions = {},
  showPreview = true,
  accept = "image/*",
  maxSize = 10,
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);

  const {
    uploading,
    uploadProgress,
    uploadError,
    uploadImage,
    resetUploadState,
  } = useImageUpload();

  // Update preview when value changes
  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      // Create local preview
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Upload to Cloudinary
      const imageUrl = await uploadImage(file, uploadOptions);

      // Call onChange with the Cloudinary URL
      if (onChange) {
        onChange(imageUrl);
      }

      // Clean up local preview
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(imageUrl);

      resetUploadState();
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message}`);
      setPreviewUrl(value); // Revert to previous value
      resetUploadState();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    if (onChange) {
      onChange("");
    }
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-600">
              Uploading... {uploadProgress}%
            </p>
          </div>
        ) : previewUrl ? (
          <div className="space-y-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-32 mx-auto rounded"
            />
            <p className="text-sm text-gray-600">Click to change image</p>
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500">Max size: {maxSize}MB</p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {uploadError}
        </div>
      )}

      {/* Remove Button */}
      {previewUrl && !uploading && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex items-center justify-center w-full px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Remove Image
        </button>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
