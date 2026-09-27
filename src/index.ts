// Component exports
export { ImageAddButton, type ImageAddButtonProps } from './components/ImageAddButton';
export { ImageThumbnail, type ImageThumbnailProps } from './components/ImageThumbnail';
export { ImageUploader } from './components/ImageUploader';
export { SourcePickerModal, type SourcePickerModalProps } from './components/SourcePickerModal';

// Hook exports
export { useImageUploader } from './hooks/useImageUploader';

// Type exports
export {
  ImageUploaderError,
  type CameraOptions,
  type ImagePickerOptions,
  type ImagePickerSource,
  type ImageUploaderErrorCode,
  type ImageUploaderErrorDetails,
  type ImageUploaderProps,
  type ImageValidationOptions,
  type RenderAddButtonProps,
  type RenderErrorProps,
  type RenderImageProps,
  type RenderRemoveButtonProps,
  type SelectedImage,
} from './types';

// Utility & Programmatic API exports
export {
  createCameraUnavailableError,
  createCompressionFailedError,
  createFileTooLargeError,
  createInvalidDimensionsError,
  createInvalidTypeError,
  createLimitExceededError,
  createPermissionDeniedError,
  createPickerCancelledError,
  createUnknownError,
} from './utils/imageErrors';

export {
  generateImageId,
  inferFileName,
  inferMimeType,
  normalizeImage,
} from './utils/normalizeImage';

export { pickImage, pickImages, reorderImages, takePhoto } from './utils/picker';

export { validateImage, validateImageCount, validateImages } from './utils/validateImage';
