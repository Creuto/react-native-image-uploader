import {
  launchCamera as mockLaunchCamera,
  launchImageLibrary as mockLaunchImageLibrary,
} from 'react-native-image-picker';
import type { SelectedImage } from '../src/types';
import { pickImage, pickImages, reorderImages, takePhoto } from '../src/utils/picker';

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

describe('picker programmatic API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('reorderImages changes item positions in array', () => {
    const images: SelectedImage[] = [
      { id: '1', uri: 'file://1.jpg' },
      { id: '2', uri: 'file://2.jpg' },
      { id: '3', uri: 'file://3.jpg' },
    ];

    const reordered = reorderImages(images, 0, 2);
    expect(reordered.map((i) => i.id)).toEqual(['2', '3', '1']);
  });

  test('pickImages calls launchImageLibrary and normalizes selected images', async () => {
    (mockLaunchImageLibrary as jest.Mock).mockResolvedValueOnce({
      assets: [
        { uri: 'file://photo1.jpg', fileName: 'photo1.jpg', fileSize: 5000 },
        { uri: 'file://photo2.jpg', fileName: 'photo2.jpg', fileSize: 8000 },
      ],
    });

    const results = await pickImages({ maxFileSize: 10000 });
    expect(results).toHaveLength(2);
    expect(results[0].uri).toBe('file://photo1.jpg');
    expect(results[1].uri).toBe('file://photo2.jpg');
    expect(mockLaunchImageLibrary).toHaveBeenCalledWith(
      expect.objectContaining({
        mediaType: 'photo',
        quality: 0.8,
      }),
    );
  });

  test('pickImages handles user cancellation throwing PICKER_CANCELLED error', async () => {
    (mockLaunchImageLibrary as jest.Mock).mockResolvedValueOnce({
      didCancel: true,
    });

    await expect(pickImages()).rejects.toThrow('User cancelled image selection.');
  });

  test('pickImages handles permission denied error', async () => {
    (mockLaunchImageLibrary as jest.Mock).mockResolvedValueOnce({
      errorCode: 'permission',
    });

    await expect(pickImages()).rejects.toThrow('Permission denied');
  });

  test('pickImage returns single image or null', async () => {
    (mockLaunchImageLibrary as jest.Mock).mockResolvedValueOnce({
      assets: [{ uri: 'file://single.jpg', fileName: 'single.jpg' }],
    });

    const result = await pickImage();
    expect(result).not.toBeNull();
    expect(result?.uri).toBe('file://single.jpg');
  });

  test('takePhoto calls launchCamera and returns normalized image', async () => {
    (mockLaunchCamera as jest.Mock).mockResolvedValueOnce({
      assets: [{ uri: 'file://camera_photo.jpg', fileName: 'camera_photo.jpg' }],
    });

    const result = await takePhoto();
    expect(result).not.toBeNull();
    expect(result?.uri).toBe('file://camera_photo.jpg');
    expect(mockLaunchCamera).toHaveBeenCalledWith(
      expect.objectContaining({
        mediaType: 'photo',
        saveToPhotos: false,
      }),
    );
  });

  test('takePhoto throws CAMERA_UNAVAILABLE error when camera is missing', async () => {
    (mockLaunchCamera as jest.Mock).mockResolvedValueOnce({
      errorCode: 'camera_unavailable',
    });

    await expect(takePhoto()).rejects.toThrow('Camera is not available');
  });
});
