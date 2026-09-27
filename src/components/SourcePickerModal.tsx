import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface SourcePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onSelectCamera: () => void;
  title?: string;
  galleryLabel?: string;
  cameraLabel?: string;
  cancelLabel?: string;
}

export const SourcePickerModal: React.FC<SourcePickerModalProps> = ({
  visible,
  onClose,
  onSelectGallery,
  onSelectCamera,
  title = 'Select Image Source',
  galleryLabel = 'Choose from Gallery',
  cameraLabel = 'Take Photo',
  cancelLabel = 'Cancel',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onClose();
              onSelectGallery();
            }}
            accessibilityRole="button"
            accessibilityLabel={galleryLabel}
          >
            <Text style={styles.optionText}>{galleryLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onClose();
              onSelectCamera();
            }}
            accessibilityRole="button"
            accessibilityLabel={cameraLabel}
          >
            <Text style={styles.optionText}>{cameraLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.cancelButton]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 34,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 0,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
});
