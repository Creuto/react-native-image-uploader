import { act, renderHook } from '@testing-library/react-native';
import { useImageUploader } from '../src/hooks/useImageUploader';
import type { SelectedImage } from '../src/types';

describe('useImageUploader hook', () => {
  const sampleImage: SelectedImage = {
    id: '1',
    uri: 'file://1.jpg',
    name: '1.jpg',
  };

  test('initializes with defaultImages', () => {
    const { result } = renderHook(() => useImageUploader({ defaultImages: [sampleImage] }));

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0]).toEqual(sampleImage);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('addImages validates and adds new images', async () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();

    const { result } = renderHook(() => useImageUploader({ maxImages: 3, onChange, onSelect }));

    const newImg: SelectedImage = { id: '2', uri: 'file://2.jpg' };

    await act(async () => {
      await result.current.addImages([newImg]);
    });

    expect(result.current.images).toHaveLength(1);
    expect(onChange).toHaveBeenCalledWith([newImg]);
    expect(onSelect).toHaveBeenCalledWith([newImg]);
  });

  test('addImages triggers error when maxImages limit is exceeded', async () => {
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useImageUploader({
        defaultImages: [sampleImage],
        maxImages: 1,
        onError,
      }),
    );

    const extraImg: SelectedImage = { id: '2', uri: 'file://2.jpg' };

    await act(async () => {
      await result.current.addImages([extraImg]);
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.error?.code).toBe('IMAGE_LIMIT_EXCEEDED');
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'IMAGE_LIMIT_EXCEEDED' }));
  });

  test('removeImage removes item by index and calls callbacks', () => {
    const onChange = jest.fn();
    const onRemove = jest.fn();

    const img1: SelectedImage = { id: '1', uri: 'file://1.jpg' };
    const img2: SelectedImage = { id: '2', uri: 'file://2.jpg' };

    const { result } = renderHook(() =>
      useImageUploader({
        defaultImages: [img1, img2],
        onChange,
        onRemove,
      }),
    );

    act(() => {
      result.current.removeImage(0);
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0].id).toBe('2');
    expect(onChange).toHaveBeenCalledWith([img2]);
    expect(onRemove).toHaveBeenCalledWith(img1, 0);
  });

  test('reorder changes order of images', () => {
    const img1: SelectedImage = { id: '1', uri: 'file://1.jpg' };
    const img2: SelectedImage = { id: '2', uri: 'file://2.jpg' };

    const { result } = renderHook(() => useImageUploader({ defaultImages: [img1, img2] }));

    act(() => {
      result.current.reorder(0, 1);
    });

    expect(result.current.images[0].id).toBe('2');
    expect(result.current.images[1].id).toBe('1');
  });

  test('supports controlled mode', () => {
    const controlledImages: SelectedImage[] = [sampleImage];
    const onChange = jest.fn();

    const { result } = renderHook(() =>
      useImageUploader({
        images: controlledImages,
        onChange,
      }),
    );

    expect(result.current.images).toEqual(controlledImages);

    act(() => {
      result.current.removeImage(0);
    });

    // In controlled mode, props stay until parent updates props
    expect(onChange).toHaveBeenCalledWith([]);
  });

  test('clearImages empties selection', () => {
    const { result } = renderHook(() => useImageUploader({ defaultImages: [sampleImage] }));

    act(() => {
      result.current.clearImages();
    });

    expect(result.current.images).toEqual([]);
  });
});
