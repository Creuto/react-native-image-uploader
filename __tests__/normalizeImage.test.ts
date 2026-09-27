import {
  generateImageId,
  inferFileName,
  inferMimeType,
  normalizeImage,
} from '../src/utils/normalizeImage';

describe('normalizeImage utilities', () => {
  test('generateImageId produces unique IDs', () => {
    const id1 = generateImageId();
    const id2 = generateImageId();
    expect(id1).toMatch(/^img_\d+_\d+_[a-z0-9]+$/);
    expect(id1).not.toEqual(id2);
  });

  test('inferMimeType correctly identifies common image extensions', () => {
    expect(inferMimeType('photo.jpg')).toBe('image/jpeg');
    expect(inferMimeType('photo.JPEG')).toBe('image/jpeg');
    expect(inferMimeType('graphic.png')).toBe('image/png');
    expect(inferMimeType('image.webp')).toBe('image/webp');
    expect(inferMimeType('animation.gif')).toBe('image/gif');
    expect(inferMimeType('photo.heic')).toBe('image/heic');
    expect(inferMimeType('unknown.xyz')).toBeUndefined();
    expect(inferMimeType(undefined)).toBeUndefined();
  });

  test('inferFileName extracts filename from URI or provides fallback', () => {
    expect(inferFileName('file:///path/to/my_photo.png')).toBe('my_photo.png');
    expect(inferFileName('/var/mobile/Containers/Data/image.jpg')).toBe('image.jpg');
    expect(inferFileName(undefined)).toMatch(/^image_\d+\.jpg$/);
  });

  test('normalizeImage normalizes raw asset into SelectedImage structure', () => {
    const rawAsset = {
      uri: 'file:///path/to/test.png',
      fileName: 'test.png',
      fileSize: 1048576,
      width: 1920,
      height: 1080,
      type: 'image/png',
    };

    const normalized = normalizeImage(rawAsset);
    expect(normalized.uri).toBe('file:///path/to/test.png');
    expect(normalized.name).toBe('test.png');
    expect(normalized.fileName).toBe('test.png');
    expect(normalized.type).toBe('image/png');
    expect(normalized.size).toBe(1048576);
    expect(normalized.width).toBe(1920);
    expect(normalized.height).toBe(1080);
    expect(normalized.id).toBeDefined();
  });

  test('normalizeImage falls back cleanly when metadata is missing', () => {
    const rawAsset = {
      uri: 'file:///path/to/unnamed_image',
    };

    const normalized = normalizeImage(rawAsset);
    expect(normalized.uri).toBe('file:///path/to/unnamed_image');
    expect(normalized.type).toBe('image/jpeg');
    expect(normalized.size).toBeUndefined();
    expect(normalized.width).toBeUndefined();
    expect(normalized.height).toBeUndefined();
  });
});
