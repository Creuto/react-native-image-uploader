import {
  launchCamera as rnLaunchCamera,
  launchImageLibrary as rnLaunchImageLibrary,
  type CameraOptions as RNCameraOptions,
  type ImageLibraryOptions as RNImageLibraryOptions,
  type ImagePickerResponse,
  type PhotoQuality,
} from 'react-native-image-picker';
import type { CameraOptions, ImagePickerOptions, SelectedImage } from '../types';
import {
  createCameraUnavailableError,
  createPermissionDeniedError,
  createPickerCancelledError,
  createUnknownError,
} from './imageErrors';
import { normalizeImage } from './normalizeImage';
import { validateImages } from './validateImage';

export function reorderImages(
  images: SelectedImage[],
  fromIndex: number,
  toIndex: number,
): SelectedImage[] {
  if (
    fromIndex < 0 ||
    fromIndex >= images.length ||
    toIndex < 0 ||
    toIndex >= images.length ||
    fromIndex === toIndex
  ) {
    return [...images];
  }
  const result = [...images];
  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);
  return result;
}

export async function pickImages(options: ImagePickerOptions = {}): Promise<SelectedImage[]> {
  const {
    selectionLimit = 0,
    quality = 0.8,
    maxWidth,
    maxHeight,
    includeBase64 = false,
    ...validationOptions
  } = options;

  const targetQuality = (options.quality ?? quality) as PhotoQuality;

  const rnOptions: RNImageLibraryOptions = {
    mediaType: 'photo',
    selectionLimit: validationOptions.maxImages || selectionLimit,
    quality: targetQuality,
    maxWidth,
    maxHeight,
    includeBase64,
  };

  const response: ImagePickerResponse = await rnLaunchImageLibrary(rnOptions);

  if (response.didCancel) {
    throw createPickerCancelledError();
  }

  if (response.errorCode) {
    if (response.errorCode === 'permission') {
      throw createPermissionDeniedError('gallery');
    }
    if (response.errorCode === 'camera_unavailable') {
      throw createCameraUnavailableError();
    }
    throw createUnknownError(response.errorMessage || response.errorCode);
  }

  if (!response.assets || response.assets.length === 0) {
    return [];
  }

  const normalized = response.assets.map((asset) =>
    normalizeImage(asset as Record<string, unknown>),
  );

  const { validImages, firstError } = await validateImages(normalized, validationOptions);

  if (firstError) {
    throw firstError;
  }

  return validImages;
}

export async function pickImage(options: ImagePickerOptions = {}): Promise<SelectedImage | null> {
  const images = await pickImages({
    ...options,
    selectionLimit: 1,
    maxImages: 1,
  });
  return images.length > 0 ? images[0] : null;
}

export async function takePhoto(options: CameraOptions = {}): Promise<SelectedImage | null> {
  const {
    quality = 0.8,
    maxWidth,
    maxHeight,
    includeBase64 = false,
    ...validationOptions
  } = options;

  const targetQuality = (options.quality ?? quality) as PhotoQuality;

  const rnOptions: RNCameraOptions = {
    mediaType: 'photo',
    quality: targetQuality,
    maxWidth,
    maxHeight,
    includeBase64,
    saveToPhotos: false,
  };

  const response: ImagePickerResponse = await rnLaunchCamera(rnOptions);

  if (response.didCancel) {
    throw createPickerCancelledError();
  }

  if (response.errorCode) {
    if (response.errorCode === 'permission') {
      throw createPermissionDeniedError('camera');
    }
    if (response.errorCode === 'camera_unavailable') {
      throw createCameraUnavailableError();
    }
    throw createUnknownError(response.errorMessage || response.errorCode);
  }

  if (!response.assets || response.assets.length === 0) {
    return null;
  }

  const normalized = response.assets.map((asset) =>
    normalizeImage(asset as Record<string, unknown>),
  );

  const { validImages, firstError } = await validateImages(normalized, validationOptions);

  if (firstError) {
    throw firstError;
  }

  return validImages.length > 0 ? validImages[0] : null;
}
