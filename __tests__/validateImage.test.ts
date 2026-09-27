import type { SelectedImage } from '../src/types';
import { validateImage, validateImageCount, validateImages } from '../src/utils/validateImage';

const sampleImage: SelectedImage = {
  id: 'img_1',
  uri: 'file:///photo.jpg',
  fileName: 'photo.jpg',
  type: 'image/jpeg',
  size: 2 * 1024 * 1024, // 2MB
  width: 1200,
  height: 800,
};

describe('validateImage utilities', () => {
  test('validateImageCount detects count limit exceedance', () => {
    const error = validateImageCount(4, 2, 5);
    expect(error).not.toBeNull();
    expect(error?.code).toBe('IMAGE_LIMIT_EXCEEDED');

    const valid = validateImageCount(2, 2, 5);
    expect(valid).toBeNull();
  });

  test('validateImage checks max file size', async () => {
    const error = await validateImage(sampleImage, {
      maxFileSize: 1 * 1024 * 1024, // 1MB limit
    });
    expect(error).not.toBeNull();
    expect(error?.code).toBe('FILE_TOO_LARGE');

    const valid = await validateImage(sampleImage, {
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });
    expect(valid).toBeNull();
  });

  test('validateImage checks allowed MIME types', async () => {
    const pngImage: SelectedImage = {
      ...sampleImage,
      type: 'image/png',
      fileName: 'photo.png',
    };

    const error = await validateImage(pngImage, {
      allowedTypes: ['image/jpeg', 'image/webp'],
    });
    expect(error).not.toBeNull();
    expect(error?.code).toBe('INVALID_FILE_TYPE');

    const valid = await validateImage(pngImage, {
      allowedTypes: ['image/jpeg', 'image/png'],
    });
    expect(valid).toBeNull();
  });

  test('validateImage checks image dimensions', async () => {
    const largeImage: SelectedImage = {
      ...sampleImage,
      width: 4000,
      height: 3000,
    };

    const error = await validateImage(largeImage, {
      maxWidth: 2000,
      maxHeight: 2000,
    });
    expect(error).not.toBeNull();
    expect(error?.code).toBe('INVALID_IMAGE_DIMENSIONS');

    const valid = await validateImage(largeImage, {
      maxWidth: 5000,
      maxHeight: 5000,
    });
    expect(valid).toBeNull();
  });

  test('validateImage executes customValidator callback', async () => {
    const customValidator = jest.fn().mockImplementation((img: SelectedImage) => {
      if (img.fileName?.includes('photo')) {
        return 'Custom validation error message';
      }
      return null;
    });

    const error = await validateImage(sampleImage, { customValidator });
    expect(error).not.toBeNull();
    expect(error?.message).toBe('Custom validation error message');
  });

  test('validateImages filters valid images and returns first error', async () => {
    const invalidImage: SelectedImage = {
      id: 'img_2',
      uri: 'file:///large.jpg',
      size: 10 * 1024 * 1024, // 10MB
    };

    const { validImages, firstError } = await validateImages([sampleImage, invalidImage], {
      maxFileSize: 5 * 1024 * 1024,
    });

    expect(validImages).toHaveLength(1);
    expect(validImages[0].id).toBe('img_1');
    expect(firstError).not.toBeNull();
    expect(firstError?.code).toBe('FILE_TOO_LARGE');
  });
});
