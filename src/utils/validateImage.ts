import type { ImageUploaderError, ImageValidationOptions, SelectedImage } from '../types';
import {
  createFileTooLargeError,
  createInvalidDimensionsError,
  createInvalidTypeError,
  createLimitExceededError,
  createUnknownError,
} from './imageErrors';
import { inferMimeType } from './normalizeImage';

export function validateImageCount(
  currentCount: number,
  incomingCount: number,
  maxImages?: number,
): ImageUploaderError | null {
  if (typeof maxImages === 'number' && maxImages > 0) {
    if (currentCount + incomingCount > maxImages) {
      return createLimitExceededError(currentCount + incomingCount, maxImages);
    }
  }
  return null;
}

export async function validateImage(
  image: SelectedImage,
  options: ImageValidationOptions,
): Promise<ImageUploaderError | null> {
  const { maxFileSize, maxWidth, maxHeight, allowedTypes, customValidator } = options;

  // 1. File size validation
  if (typeof maxFileSize === 'number' && maxFileSize > 0) {
    if (typeof image.size === 'number' && image.size > maxFileSize) {
      return createFileTooLargeError(image, maxFileSize);
    }
  }

  // 2. Allowed types validation (MIME type or fallback extension)
  if (allowedTypes && allowedTypes.length > 0) {
    const mimeType = image.type || inferMimeType(image.fileName || image.name || image.uri);
    const normalizedAllowed = allowedTypes.map((t) => t.toLowerCase());

    const isValidType = mimeType ? normalizedAllowed.includes(mimeType.toLowerCase()) : false;

    if (!isValidType) {
      return createInvalidTypeError(image, allowedTypes);
    }
  }

  // 3. Image dimensions validation
  if (typeof maxWidth === 'number' || typeof maxHeight === 'number') {
    const widthExceeded =
      typeof maxWidth === 'number' && typeof image.width === 'number' && image.width > maxWidth;

    const heightExceeded =
      typeof maxHeight === 'number' && typeof image.height === 'number' && image.height > maxHeight;

    if (widthExceeded || heightExceeded) {
      return createInvalidDimensionsError(image, maxWidth, maxHeight);
    }
  }

  // 4. Custom user validator callback
  if (customValidator) {
    try {
      const customErrorMsg = await customValidator(image);
      if (customErrorMsg) {
        return createUnknownError(customErrorMsg);
      }
    } catch (err) {
      return createUnknownError(err);
    }
  }

  return null;
}

export async function validateImages(
  images: SelectedImage[],
  options: ImageValidationOptions,
  currentCount = 0,
): Promise<{ validImages: SelectedImage[]; firstError: ImageUploaderError | null }> {
  const countError = validateImageCount(currentCount, images.length, options.maxImages);
  if (countError) {
    return { validImages: [], firstError: countError };
  }

  const validImages: SelectedImage[] = [];
  let firstError: ImageUploaderError | null = null;

  for (const img of images) {
    const err = await validateImage(img, options);
    if (err) {
      if (!firstError) {
        firstError = err;
      }
    } else {
      validImages.push(img);
    }
  }

  return { validImages, firstError };
}
