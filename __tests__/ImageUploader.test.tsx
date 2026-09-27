import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ImageUploader } from '../src/components/ImageUploader';
import type { SelectedImage } from '../src/types';

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

describe('<ImageUploader /> component', () => {
  const sampleImages: SelectedImage[] = [
    { id: 'img-1', uri: 'file://1.jpg', name: '1.jpg' },
    { id: 'img-2', uri: 'file://2.jpg', name: '2.jpg' },
  ];

  test('renders image thumbnails and add button correctly', () => {
    const { UNSAFE_getByProps } = render(
      <ImageUploader defaultImages={sampleImages} testID="test-uploader" />,
    );

    expect(UNSAFE_getByProps({ testID: 'test-uploader' })).toBeTruthy();
    expect(UNSAFE_getByProps({ testID: 'test-uploader-item-0' })).toBeTruthy();
    expect(UNSAFE_getByProps({ testID: 'test-uploader-item-1' })).toBeTruthy();
    expect(UNSAFE_getByProps({ testID: 'test-uploader-add-button' })).toBeTruthy();
  });

  test('removes an image when remove button is pressed', () => {
    const onRemove = jest.fn();
    const onChange = jest.fn();

    const { UNSAFE_getByProps } = render(
      <ImageUploader
        defaultImages={sampleImages}
        onRemove={onRemove}
        onChange={onChange}
        testID="test-uploader"
      />,
    );

    const removeBtn = UNSAFE_getByProps({ testID: 'test-uploader-remove-0' });
    fireEvent.press(removeBtn);

    expect(onRemove).toHaveBeenCalledWith(sampleImages[0], 0);
    expect(onChange).toHaveBeenCalledWith([sampleImages[1]]);
  });

  test('hides add button when maxImages is reached', () => {
    const { UNSAFE_queryByProps } = render(
      <ImageUploader defaultImages={sampleImages} maxImages={2} testID="test-uploader" />,
    );

    expect(UNSAFE_queryByProps({ testID: 'test-uploader-add-button' })).toBeNull();
  });

  test('renders custom renderAddButton when provided', () => {
    const renderAddButton = jest.fn().mockReturnValue(null);

    render(<ImageUploader renderAddButton={renderAddButton} testID="test-uploader" />);

    expect(renderAddButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: false,
        loading: false,
        source: 'both',
      }),
    );
  });

  test('respects disabled prop', () => {
    const onRemove = jest.fn();
    const { UNSAFE_getByProps } = render(
      <ImageUploader
        defaultImages={sampleImages}
        disabled
        onRemove={onRemove}
        testID="test-uploader"
      />,
    );

    const removeBtn = UNSAFE_getByProps({ testID: 'test-uploader-remove-0' });
    fireEvent.press(removeBtn);

    expect(onRemove).not.toHaveBeenCalled();
  });
});
