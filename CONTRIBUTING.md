# Contributing to @creuto/react-native-image-uploader

Thank you for considering contributing to `@creuto/react-native-image-uploader`!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Creuto/react-native-image-uploader.git
   cd react-native-image-uploader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run TypeScript type checks:
   ```bash
   npm run typecheck
   ```

4. Run unit tests:
   ```bash
   npm test
   ```

5. Run linter & formatter checks:
   ```bash
   npm run lint
   npm run format:check
   ```

6. Build the package:
   ```bash
   npm run build
   ```

## Pull Request Guidelines

- Ensure all unit tests pass (`npm test`).
- Keep runtime dependencies minimal.
- Maintain strict accessibility principles: accessible controls, proper roles and labels, adequate touch targets.
- Uploading logic must remain application/backend owned (do not embed cloud provider SDKs into the package).
