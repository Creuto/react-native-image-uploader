import type { SelectedImage } from '../types';

let idCounter = 0;

export function generateImageId(): string {
  idCounter += 1;
  return `img_${Date.now()}_${idCounter}_${Math.random().toString(36).substring(2, 9)}`;
}

export function inferMimeType(filenameOrUri?: string): string | undefined {
  if (!filenameOrUri) return undefined;
  const lower = filenameOrUri.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.heic')) return 'image/heic';
  if (lower.endsWith('.heif')) return 'image/heif';
  if (lower.endsWith('.bmp')) return 'image/bmp';
  return undefined;
}

export function inferFileName(uri?: string): string {
  if (!uri) return `image_${Date.now()}.jpg`;
  const parts = uri.split('/');
  const lastPart = parts[parts.length - 1];
  if (lastPart && lastPart.includes('.')) {
    return lastPart;
  }
  return `image_${Date.now()}.jpg`;
}

export function normalizeImage(rawAsset: Record<string, unknown>): SelectedImage {
  const uri = typeof rawAsset.uri === 'string' ? rawAsset.uri : '';
  const fileName =
    (typeof rawAsset.fileName === 'string' && rawAsset.fileName) ||
    (typeof rawAsset.name === 'string' && rawAsset.name) ||
    inferFileName(uri);

  const name = fileName;

  const type =
    (typeof rawAsset.type === 'string' && rawAsset.type) ||
    inferMimeType(fileName) ||
    inferMimeType(uri) ||
    'image/jpeg';

  const size =
    typeof rawAsset.fileSize === 'number'
      ? rawAsset.fileSize
      : typeof rawAsset.size === 'number'
        ? rawAsset.size
        : undefined;

  const width = typeof rawAsset.width === 'number' ? rawAsset.width : undefined;
  const height = typeof rawAsset.height === 'number' ? rawAsset.height : undefined;
  const base64 = typeof rawAsset.base64 === 'string' ? rawAsset.base64 : undefined;
  const originalPath =
    typeof rawAsset.originalPath === 'string' ? rawAsset.originalPath : undefined;

  const id = (typeof rawAsset.id === 'string' && rawAsset.id) || generateImageId();

  return {
    id,
    uri,
    name,
    fileName,
    type,
    size,
    width,
    height,
    base64,
    originalPath,
  };
}
