# Softbook

Softbook is a React Native application designed for library or study center management. It enables administrators to manage student admissions, seat assignments, attendance, and student records, and provides features like PDF receipt generation and document uploads.

---

## Features

- **Authentication:** Secure admin login to access the app.
- **Dashboard (Welcome):** Overview of total rooms, shifts, and students.
- **Student Admission:** Add new students, collect details, upload ID proof, and assign seats.
- **Seat Selection:** Visual seat selection based on room and shift.
- **Student Records:** Searchable, filterable list of all students with due dates and details.
- **Attendance:** Mark and view attendance records for students, filterable by date and name.
- **Profile:** View admin/library profile, subscription info, and contact support.
- **PDF Generation:** Generate and share admission receipts as PDFs.
- **Document Picker:** Upload documents and images (with a temporary workaround for React Native 0.80.1).

## Main Screens

- **Splash:** Initial loading screen.
- **Login:** Admin authentication.
- **Welcome:** Dashboard with stats and quick info.
- **New Admission:** Form for adding new students.
- **Seat Selection:** Assign seats to students.
- **Final Confirmation:** Confirm admission and generate PDF receipt.
- **Student Record:** List and search all students.
- **Attendance:** Mark and view attendance.
- **Profile:** Admin/library details and logout.

## Tech Stack

- React Native 0.80.1
- TypeScript
- React Navigation
- Axios (API calls)
- react-native-html-to-pdf (PDF generation)
- react-native-share (sharing PDFs)
- @react-native-documents/picker (document/image upload)
- moment (date handling)

---

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

---

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
