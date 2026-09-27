import { ImageUploaderError, type ImagePickerSource, type SelectedImage } from '../types';

export function createLimitExceededError(
  requestedCount: number,
  maxImages: number,
): ImageUploaderError {
  return new ImageUploaderError(
    'IMAGE_LIMIT_EXCEEDED',
    `Cannot select ${requestedCount} image(s). Maximum allowed is ${maxImages}.`,
    { requestedCount, maxImages },
  );
}

export function createFileTooLargeError(
  image: SelectedImage,
  maxFileSize: number,
): ImageUploaderError {
  const sizeMB = (image.size ? image.size / (1024 * 1024) : 0).toFixed(2);
  const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
  return new ImageUploaderError(
    'FILE_TOO_LARGE',
    `File size (${sizeMB} MB) exceeds maximum limit of ${maxSizeMB} MB.`,
    { image, fileSize: image.size, maxFileSize },
  );
}

export function createInvalidTypeError(
  image: SelectedImage,
  allowedTypes: string[],
): ImageUploaderError {
  const type = image.type || 'unknown';
  return new ImageUploaderError(
    'INVALID_FILE_TYPE',
    `File type '${type}' is not allowed. Allowed types: ${allowedTypes.join(', ')}.`,
    { image, fileType: type, allowedTypes },
  );
}

export function createInvalidDimensionsError(
  image: SelectedImage,
  maxWidth?: number,
  maxHeight?: number,
): ImageUploaderError {
  const dims = `${image.width || 0}x${image.height || 0}`;
  const maxDims = `${maxWidth || 'unlimited'}x${maxHeight || 'unlimited'}`;
  return new ImageUploaderError(
    'INVALID_IMAGE_DIMENSIONS',
    `Image dimensions (${dims}) exceed maximum allowed dimensions (${maxDims}).`,
    {
      image,
      dimensions: { width: image.width, height: image.height },
      maxDimensions: { maxWidth, maxHeight },
    },
  );
}

export function createPermissionDeniedError(source: ImagePickerSource): ImageUploaderError {
  return new ImageUploaderError(
    'PERMISSION_DENIED',
    `Permission denied for accessing ${source === 'camera' ? 'camera' : 'photo library'}.`,
    { source },
  );
}

export function createCameraUnavailableError(): ImageUploaderError {
  return new ImageUploaderError(
    'CAMERA_UNAVAILABLE',
    'Camera is not available on this device or emulator.',
  );
}

export function createPickerCancelledError(): ImageUploaderError {
  return new ImageUploaderError('PICKER_CANCELLED', 'User cancelled image selection.');
}

export function createCompressionFailedError(details?: string): ImageUploaderError {
  return new ImageUploaderError(
    'COMPRESSION_FAILED',
    `Image compression failed: ${details || 'Unknown compression error.'}`,
  );
}

export function createUnknownError(error: unknown): ImageUploaderError {
  const message =
    error instanceof Error ? error.message : String(error || 'An unexpected error occurred');
  return new ImageUploaderError('UNKNOWN_ERROR', message, { originalError: error });
}
