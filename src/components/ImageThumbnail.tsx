import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type {
  ImageUploaderProps,
  RenderImageProps,
  RenderRemoveButtonProps,
  SelectedImage,
} from '../types';

export interface ImageThumbnailProps {
  image: SelectedImage;
  index: number;
  totalImages: number;
  onRemove: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  allowReorder?: boolean;
  disabled?: boolean;
  removeButtonLabel?: string;
  imageStyle?: ImageUploaderProps['imageStyle'];
  thumbnailStyle?: ImageUploaderProps['thumbnailStyle'];
  removeButtonStyle?: ImageUploaderProps['removeButtonStyle'];
  renderImage?: ImageUploaderProps['renderImage'];
  renderRemoveButton?: ImageUploaderProps['renderRemoveButton'];
  testID?: string;
}

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  image,
  index,
  totalImages,
  onRemove,
  onMoveUp,
  onMoveDown,
  allowReorder = false,
  disabled = false,
  removeButtonLabel = 'Remove image',
  imageStyle,
  thumbnailStyle,
  removeButtonStyle,
  renderImage,
  renderRemoveButton,
  testID,
}) => {
  const handleRemove = () => {
    if (!disabled) {
      onRemove(index);
    }
  };

  const handleMoveUp = () => {
    if (!disabled && onMoveUp && index > 0) {
      onMoveUp(index);
    }
  };

  const handleMoveDown = () => {
    if (!disabled && onMoveDown && index < totalImages - 1) {
      onMoveDown(index);
    }
  };

  const isFirst = index === 0;
  const isLast = index === totalImages - 1;

  if (renderImage) {
    const customProps: RenderImageProps = {
      image,
      index,
      onRemove: handleRemove,
      disabled,
      onMoveUp: handleMoveUp,
      onMoveDown: handleMoveDown,
      isFirst,
      isLast,
    };
    return <>{renderImage(customProps)}</>;
  }

  const renderRemove = () => {
    if (renderRemoveButton) {
      const removeProps: RenderRemoveButtonProps = {
        onRemove: handleRemove,
        disabled,
        index,
      };
      return <>{renderRemoveButton(removeProps)}</>;
    }

    return (
      <TouchableOpacity
        style={[styles.removeButton, removeButtonStyle, disabled && styles.disabledButton]}
        onPress={handleRemove}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${removeButtonLabel} ${index + 1}`}
        accessibilityHint="Removes this image from selection"
        testID={testID ? `${testID}-remove-${index}` : `remove-image-${index}`}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, thumbnailStyle]}
      testID={testID ? `${testID}-item-${index}` : `image-thumbnail-${index}`}
    >
      <Image
        source={{ uri: image.uri }}
        style={[styles.image, imageStyle]}
        resizeMode="cover"
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Image ${index + 1} of ${totalImages}`}
        accessibilityIgnoresInvertColors
      />

      {renderRemove()}

      {allowReorder && totalImages > 1 && (
        <View style={styles.reorderContainer}>
          {!isFirst && (
            <TouchableOpacity
              style={[styles.reorderButton, disabled && styles.disabledButton]}
              onPress={handleMoveUp}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`Move image ${index + 1} left`}
            >
              <Text style={styles.reorderText}>‹</Text>
            </TouchableOpacity>
          )}
          {!isLast && (
            <TouchableOpacity
              style={[styles.reorderButton, disabled && styles.disabledButton]}
              onPress={handleMoveDown}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`Move image ${index + 1} right`}
            >
              <Text style={styles.reorderText}>›</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 90,
    borderRadius: 8,
    margin: 4,
    overflow: 'visible',
    position: 'relative',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  reorderContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  reorderButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
