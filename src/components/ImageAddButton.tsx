import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ImagePickerSource, ImageUploaderProps, RenderAddButtonProps } from '../types';
import { SourcePickerModal } from './SourcePickerModal';

export interface ImageAddButtonProps {
  onSelectGallery: () => void;
  onSelectCamera: () => void;
  source?: ImagePickerSource;
  disabled?: boolean;
  loading?: boolean;
  addButtonLabel?: string;
  addButtonStyle?: ImageUploaderProps['addButtonStyle'];
  renderAddButton?: ImageUploaderProps['renderAddButton'];
  testID?: string;
}

export const ImageAddButton: React.FC<ImageAddButtonProps> = ({
  onSelectGallery,
  onSelectCamera,
  source = 'both',
  disabled = false,
  loading = false,
  addButtonLabel = 'Add image',
  addButtonStyle,
  renderAddButton,
  testID,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = (sourceOverride?: 'gallery' | 'camera') => {
    if (disabled || loading) return;

    if (sourceOverride === 'gallery') {
      onSelectGallery();
      return;
    }
    if (sourceOverride === 'camera') {
      onSelectCamera();
      return;
    }

    if (source === 'gallery') {
      onSelectGallery();
    } else if (source === 'camera') {
      onSelectCamera();
    } else {
      setModalVisible(true);
    }
  };

  if (renderAddButton) {
    const renderProps: RenderAddButtonProps = {
      onPress: handlePress,
      disabled,
      loading,
      source,
      openSourcePicker: () => setModalVisible(true),
    };
    return (
      <>
        {renderAddButton(renderProps)}
        <SourcePickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectGallery={onSelectGallery}
          onSelectCamera={onSelectCamera}
        />
      </>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.container, addButtonStyle, (disabled || loading) && styles.disabled]}
        onPress={() => handlePress()}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={addButtonLabel}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        testID={testID || 'add-image-button'}
      >
        {loading ? (
          <ActivityIndicator color="#4F46E5" size="small" />
        ) : (
          <View style={styles.inner}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.addText}>Add</Text>
          </View>
        )}
      </TouchableOpacity>

      <SourcePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectGallery={onSelectGallery}
        onSelectCamera={onSelectCamera}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 24,
    color: '#4F46E5',
    fontWeight: '300',
    lineHeight: 26,
  },
  addText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
  },
});
