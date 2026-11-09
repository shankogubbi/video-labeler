# VideoLabeler

Record, label, and play videos stored on your device. Uninstalling the app deletes saved videos and labels.

## Run

```sh
npm ci
npx expo start --android
```

## Check

```sh
npx expo lint
npx tsc --noEmit
```

## Build APK

```sh
npx eas-cli@latest build --platform android --profile preview
```

Requires EAS sign-in and access to the project.

## OTA updates

Install a new preview APK once to enable OTA updates. Older builds without expo-updates cannot receive them.

```sh
npm run build:preview
npm run update:preview -- --message "Describe the change"
```

Preview and production use separate channels. Test on preview before publishing:

```sh
npm run update:production -- --message "Describe the change"
```

The app checks at launch, downloads in the background, and applies the update on the next launch. It keeps working offline using the cached or bundled version. Updates never force a restart while you are labeling a video.

Runtime fingerprints prevent updates from loading into incompatible native builds. Changes to native dependencies or configuration require a new APK or store build.

To undo an update, run `npx eas-cli@latest update:rollback` and select the affected channel and runtime.

Verify on a release APK: publish to its channel, open the app with a network connection, wait for the download, then close and reopen. Confirm existing videos and labels remain accessible.
