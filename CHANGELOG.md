# Changelog

All notable changes to `@creuto/react-native-image-uploader` will be documented in this file.

## [0.1.0] - 2026-09-27

### Added
- Initial release of `@creuto/react-native-image-uploader`.
- Primary `<ImageUploader />` component supporting photo gallery selection, camera capture, and thumbnail previews.
- Controlled & uncontrolled state management via `useImageUploader` hook.
- Local validation rules: `maxImages`, `maxFileSize`, `allowedTypes`, `maxWidth`, `maxHeight`, and `customValidator`.
- Local image compression support (`compressionQuality`).
- Image reordering helpers and thumbnail controls (`allowReorder`).
- UI styling customization props (`containerStyle`, `imageStyle`, `thumbnailStyle`, `removeButtonStyle`, `addButtonStyle`).
- Custom render props (`renderAddButton`, `renderImage`, `renderRemoveButton`, `renderError`).
- Programmatic API (`pickImages`, `pickImage`, `takePhoto`, `validateImage`, `normalizeImage`).
- Accessibility support (`accessibilityRole`, `accessibilityLabel`, touch targets, error announcements).
- Typed error system with `ImageUploaderError` and standardized error codes.
- Full Jest test suite covering normalization, validation, hook state, components, cancellation, permissions, and callbacks.
- Interactive demonstration application (`example/`).
