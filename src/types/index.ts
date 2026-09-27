import type React from 'react';
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ImagePickerSource = 'gallery' | 'camera' | 'both';

export interface SelectedImage {
  id: string;
  uri: string;
  name?: string;
  fileName?: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
  base64?: string;
  originalPath?: string;
}

export interface ImageValidationOptions {
  maxImages?: number;
  maxFileSize?: number; // In bytes
  maxWidth?: number;
  maxHeight?: number;
  allowedTypes?: string[]; // e.g., ['image/jpeg', 'image/png', 'image/webp']
  customValidator?: (image: SelectedImage) => string | null | Promise<string | null>;
}

export interface ImagePickerOptions extends ImageValidationOptions {
  source?: ImagePickerSource;
  selectionLimit?: number;
  quality?: number; // 0.0 to 1.0
  maxWidth?: number;
  maxHeight?: number;
  includeBase64?: boolean;
}

export interface CameraOptions extends ImageValidationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  includeBase64?: boolean;
}

export type ImageUploaderErrorCode =
  | 'IMAGE_LIMIT_EXCEEDED'
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'INVALID_IMAGE_DIMENSIONS'
  | 'PERMISSION_DENIED'
  | 'CAMERA_UNAVAILABLE'
  | 'PICKER_CANCELLED'
  | 'COMPRESSION_FAILED'
  | 'UNKNOWN_ERROR';

export interface ImageUploaderErrorDetails {
  image?: SelectedImage;
  requestedCount?: number;
  maxImages?: number;
  fileSize?: number;
  maxFileSize?: number;
  fileType?: string;
  allowedTypes?: string[];
  dimensions?: { width?: number; height?: number };
  maxDimensions?: { maxWidth?: number; maxHeight?: number };
  [key: string]: unknown;
}

export class ImageUploaderError extends Error {
  code: ImageUploaderErrorCode;
  details?: ImageUploaderErrorDetails;

  constructor(code: ImageUploaderErrorCode, message: string, details?: ImageUploaderErrorDetails) {
    super(message);
    this.name = 'ImageUploaderError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ImageUploaderError.prototype);
  }
}

export interface RenderAddButtonProps {
  onPress: (sourceOverride?: 'gallery' | 'camera') => void;
  disabled: boolean;
  loading: boolean;
  source: ImagePickerSource;
  openSourcePicker?: () => void;
}

export interface RenderImageProps {
  image: SelectedImage;
  index: number;
  onRemove: () => void;
  disabled: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export interface RenderRemoveButtonProps {
  onRemove: () => void;
  disabled: boolean;
  index: number;
}

export interface RenderErrorProps {
  error: ImageUploaderError | null;
  onClear: () => void;
}

export interface ImageUploaderProps extends ImageValidationOptions {
  // State control
  images?: SelectedImage[];
  defaultImages?: SelectedImage[];
  onChange?: (images: SelectedImage[]) => void;
  onSelect?: (images: SelectedImage[]) => void;
  onRemove?: (image: SelectedImage, index: number) => void;
  onError?: (error: ImageUploaderError) => void;
  onPermissionDenied?: (source: ImagePickerSource) => void;

  // Picker configuration
  source?: ImagePickerSource;
  compressionQuality?: number;
  disabled?: boolean;
  loading?: boolean;
  autoValidate?: boolean;
  allowReorder?: boolean;

  // Custom styles
  containerStyle?: StyleProp<ViewStyle>;
  gridStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  thumbnailStyle?: StyleProp<ViewStyle>;
  removeButtonStyle?: StyleProp<ViewStyle>;
  addButtonStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  errorContainerStyle?: StyleProp<ViewStyle>;

  // Custom render props
  renderAddButton?: (props: RenderAddButtonProps) => React.ReactNode;
  renderImage?: (props: RenderImageProps) => React.ReactNode;
  renderRemoveButton?: (props: RenderRemoveButtonProps) => React.ReactNode;
  renderError?: (props: RenderErrorProps) => React.ReactNode;

  // Accessibility & Labels
  addButtonLabel?: string;
  removeButtonLabel?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}
