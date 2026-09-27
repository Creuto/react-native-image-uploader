import { useCallback, useState } from 'react';
import type {
  ImagePickerSource,
  ImageUploaderError,
  ImageUploaderProps,
  SelectedImage,
} from '../types';
import { createUnknownError } from '../utils/imageErrors';
import { pickImages, reorderImages, takePhoto } from '../utils/picker';
import { validateImageCount, validateImages } from '../utils/validateImage';

export function useImageUploader(props: ImageUploaderProps = {}) {
  const {
    images: controlledImages,
    defaultImages = [],
    onChange,
    onSelect,
    onRemove,
    onError,
    onPermissionDenied,
    maxImages,
    maxFileSize,
    maxWidth,
    maxHeight,
    allowedTypes,
    customValidator,
    compressionQuality = 0.8,
    disabled = false,
  } = props;

  const isControlled = controlledImages !== undefined;
  const [internalImages, setInternalImages] = useState<SelectedImage[]>(defaultImages);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ImageUploaderError | null>(null);

  const images = isControlled ? controlledImages : internalImages;

  const updateImages = useCallback(
    (nextImages: SelectedImage[]) => {
      if (!isControlled) {
        setInternalImages(nextImages);
      }
      onChange?.(nextImages);
    },
    [isControlled, onChange],
  );

  const handleError = useCallback(
    (err: ImageUploaderError, source?: ImagePickerSource) => {
      setError(err);
      onError?.(err);
      if (err.code === 'PERMISSION_DENIED' && source) {
        onPermissionDenied?.(source);
      }
    },
    [onError, onPermissionDenied],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const addImages = useCallback(
    async (incoming: SelectedImage[]) => {
      if (disabled || incoming.length === 0) return;
      clearError();

      const countErr = validateImageCount(images.length, incoming.length, maxImages);
      if (countErr) {
        handleError(countErr);
        return;
      }

      const { validImages, firstError } = await validateImages(
        incoming,
        { maxImages, maxFileSize, maxWidth, maxHeight, allowedTypes, customValidator },
        images.length,
      );

      if (firstError) {
        handleError(firstError);
      }

      if (validImages.length > 0) {
        const updated = [...images, ...validImages];
        updateImages(updated);
        onSelect?.(validImages);
      }
    },
    [
      disabled,
      images,
      maxImages,
      maxFileSize,
      maxWidth,
      maxHeight,
      allowedTypes,
      customValidator,
      clearError,
      handleError,
      updateImages,
      onSelect,
    ],
  );

  const removeImage = useCallback(
    (indexOrId: number | string) => {
      if (disabled) return;
      clearError();

      let targetIndex = -1;
      if (typeof indexOrId === 'number') {
        targetIndex = indexOrId;
      } else {
        targetIndex = images.findIndex((img) => img.id === indexOrId);
      }

      if (targetIndex >= 0 && targetIndex < images.length) {
        const removedItem = images[targetIndex];
        const next = images.filter((_, idx) => idx !== targetIndex);
        updateImages(next);
        onRemove?.(removedItem, targetIndex);
      }
    },
    [disabled, images, clearError, updateImages, onRemove],
  );

  const reorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled) return;
      clearError();
      const next = reorderImages(images, fromIndex, toIndex);
      updateImages(next);
    },
    [disabled, images, clearError, updateImages],
  );

  const clearImages = useCallback(() => {
    if (disabled) return;
    clearError();
    updateImages([]);
  }, [disabled, clearError, updateImages]);

  const selectFromGallery = useCallback(async () => {
    if (disabled || loading) return;
    if (maxImages && images.length >= maxImages) {
      const err = validateImageCount(images.length, 1, maxImages);
      if (err) handleError(err);
      return;
    }

    setLoading(true);
    clearError();

    try {
      const remainingLimit = maxImages ? maxImages - images.length : 0;
      const selected = await pickImages({
        maxImages: remainingLimit > 0 ? remainingLimit : undefined,
        maxFileSize,
        maxWidth,
        maxHeight,
        allowedTypes,
        customValidator,
        quality: compressionQuality,
      });

      if (selected.length > 0) {
        const updated = [...images, ...selected];
        updateImages(updated);
        onSelect?.(selected);
      }
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      if (errObj?.code === 'PICKER_CANCELLED') {
        // User cancelled picker
      } else if (errObj && typeof errObj.code === 'string') {
        handleError(err as ImageUploaderError, 'gallery');
      } else {
        handleError(createUnknownError(err), 'gallery');
      }
    } finally {
      setLoading(false);
    }
  }, [
    disabled,
    loading,
    maxImages,
    images,
    maxFileSize,
    maxWidth,
    maxHeight,
    allowedTypes,
    customValidator,
    compressionQuality,
    clearError,
    handleError,
    updateImages,
    onSelect,
  ]);

  const takePhotoFromCamera = useCallback(async () => {
    if (disabled || loading) return;
    if (maxImages && images.length >= maxImages) {
      const err = validateImageCount(images.length, 1, maxImages);
      if (err) handleError(err);
      return;
    }

    setLoading(true);
    clearError();

    try {
      const photo = await takePhoto({
        maxFileSize,
        maxWidth,
        maxHeight,
        allowedTypes,
        customValidator,
        quality: compressionQuality,
      });

      if (photo) {
        const updated = [...images, photo];
        updateImages(updated);
        onSelect?.([photo]);
      }
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      if (errObj?.code === 'PICKER_CANCELLED') {
        // User cancelled camera
      } else if (errObj && typeof errObj.code === 'string') {
        handleError(err as ImageUploaderError, 'camera');
      } else {
        handleError(createUnknownError(err), 'camera');
      }
    } finally {
      setLoading(false);
    }
  }, [
    disabled,
    loading,
    maxImages,
    images,
    maxFileSize,
    maxWidth,
    maxHeight,
    allowedTypes,
    customValidator,
    compressionQuality,
    clearError,
    handleError,
    updateImages,
    onSelect,
  ]);

  return {
    images,
    loading,
    error,
    addImages,
    removeImage,
    reorder,
    clearImages,
    clearError,
    selectFromGallery,
    takePhotoFromCamera,
  };
}
