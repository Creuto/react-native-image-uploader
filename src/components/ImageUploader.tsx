import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useImageUploader } from '../hooks/useImageUploader';
import type { ImageUploaderProps, RenderErrorProps } from '../types';
import { ImageAddButton } from './ImageAddButton';
import { ImageThumbnail } from './ImageThumbnail';

export const ImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const {
    images,
    loading,
    error,
    removeImage,
    reorder,
    clearError,
    selectFromGallery,
    takePhotoFromCamera,
  } = useImageUploader(props);

  const {
    maxImages,
    source = 'both',
    disabled = false,
    allowReorder = false,
    containerStyle,
    gridStyle,
    imageStyle,
    thumbnailStyle,
    removeButtonStyle,
    addButtonStyle,
    errorContainerStyle,
    errorTextStyle,
    renderAddButton,
    renderImage,
    renderRemoveButton,
    renderError,
    addButtonLabel = 'Add image',
    removeButtonLabel = 'Remove image',
    accessibilityLabel,
    accessibilityHint,
    testID = 'image-uploader',
  } = props;

  const showAddButton = !maxImages || images.length < maxImages;

  const renderErrorContent = () => {
    if (!error) return null;

    if (renderError) {
      const errorProps: RenderErrorProps = {
        error,
        onClear: clearError,
      };
      return <>{renderError(errorProps)}</>;
    }

    return (
      <View style={[styles.errorContainer, errorContainerStyle]} testID={`${testID}-error`}>
        <Text style={[styles.errorText, errorTextStyle]}>{error.message}</Text>
        <TouchableOpacity
          onPress={clearError}
          style={styles.errorCloseButton}
          accessibilityRole="button"
          accessibilityLabel="Dismiss error"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.errorCloseText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <View style={[styles.grid, gridStyle]}>
        {images.map((img, index) => (
          <ImageThumbnail
            key={img.id || `${img.uri}-${index}`}
            image={img}
            index={index}
            totalImages={images.length}
            onRemove={removeImage}
            onMoveUp={(idx) => reorder(idx, idx - 1)}
            onMoveDown={(idx) => reorder(idx, idx + 1)}
            allowReorder={allowReorder}
            disabled={disabled}
            removeButtonLabel={removeButtonLabel}
            imageStyle={imageStyle}
            thumbnailStyle={thumbnailStyle}
            removeButtonStyle={removeButtonStyle}
            renderImage={renderImage}
            renderRemoveButton={renderRemoveButton}
            testID={testID}
          />
        ))}

        {showAddButton && (
          <ImageAddButton
            onSelectGallery={selectFromGallery}
            onSelectCamera={takePhotoFromCamera}
            source={source}
            disabled={disabled}
            loading={loading}
            addButtonLabel={addButtonLabel}
            addButtonStyle={addButtonStyle}
            renderAddButton={renderAddButton}
            testID={`${testID}-add-button`}
          />
        )}
      </View>

      {renderErrorContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
  },
  errorCloseButton: {
    padding: 4,
  },
  errorCloseText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
