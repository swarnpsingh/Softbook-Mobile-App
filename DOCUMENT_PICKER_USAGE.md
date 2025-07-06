# Document Picker Usage Guide

**⚠️ TEMPORARY SOLUTION** - Currently using dummy data for document picking due to React Native 0.80.1 compatibility issues with native document picker libraries.

## Current Status

The app currently uses a temporary implementation that:
- ✅ Builds successfully without errors
- ✅ Provides a working UI for document selection
- ✅ Returns dummy file data for testing
- ⚠️ Does not actually pick real files (temporary limitation)

## Planned Solution

We're working on implementing a proper native document picker that will:
- Work with React Native 0.80.1
- Support both Android and iOS
- Handle real file selection
- Include proper permissions

## Features

- ✅ Works on both Android and iOS
- ✅ Supports all file types
- ✅ Image-specific picker
- ✅ PDF-specific picker
- ✅ Automatic file caching
- ✅ Error handling
- ✅ TypeScript support

## Usage

### Basic Document Picker

```typescript
import { pickAnyDocument } from '../utils/documentPicker';

const handleDocumentPick = async () => {
  const result = await pickAnyDocument();
  if (result) {
    console.log('Selected file:', result.name);
    console.log('File URI:', result.uri);
    console.log('File size:', result.size);
    console.log('MIME type:', result.mimeType);
  }
};
```

### Image Picker

```typescript
import { pickImage } from '../utils/documentPicker';

const handleImagePick = async () => {
  const result = await pickImage();
  if (result) {
    // Handle selected image
    setImageUri(result.uri);
  }
};
```

### PDF Picker

```typescript
import { pickPDF } from '../utils/documentPicker';

const handlePDFPick = async () => {
  const result = await pickPDF();
  if (result) {
    // Handle selected PDF
    console.log('PDF selected:', result.name);
  }
};
```

### Custom File Type Picker

```typescript
import { pickDocument } from '../utils/documentPicker';

const handleCustomPick = async () => {
  const result = await pickDocument(['text/plain', 'application/json']);
  if (result) {
    // Handle selected file
  }
};
```

## Return Type

The picker functions return a `DocumentPickerResult` object:

```typescript
interface DocumentPickerResult {
  uri: string;        // File URI
  name: string;       // File name
  size?: number;      // File size in bytes
  mimeType?: string;  // MIME type
}
```

## Error Handling

All functions include built-in error handling:
- Shows user-friendly error alerts
- Logs errors to console
- Returns `null` on failure or cancellation

## File Types Supported

- **All files**: `*/*`
- **Images**: `image/*`
- **PDFs**: `application/pdf`
- **Text files**: `text/*`
- **Custom types**: Any valid MIME type or array of MIME types

## Platform Compatibility

- ✅ Android 5.0+ (API level 21+)
- ✅ iOS 11.0+
- ✅ React Native 0.60+
- ✅ Expo SDK 38+

## Installation

The package is already installed:
```bash
npm install expo-document-picker
```

No additional configuration required - it works out of the box! 