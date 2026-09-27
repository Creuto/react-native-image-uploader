jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(() =>
    Promise.resolve({
      didCancel: false,
      assets: [
        {
          uri: 'file:///mock/image.jpg',
          fileName: 'image.jpg',
          fileSize: 1024,
          type: 'image/jpeg',
          width: 800,
          height: 600,
        },
      ],
    })
  ),
  launchCamera: jest.fn(() =>
    Promise.resolve({
      didCancel: false,
      assets: [
        {
          uri: 'file:///mock/camera.jpg',
          fileName: 'camera.jpg',
          fileSize: 2048,
          type: 'image/jpeg',
          width: 1200,
          height: 900,
        },
      ],
    })
  ),
}));
