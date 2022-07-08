nano ./android/app/build.gradle
npm run build -- --mode insider
firebase deploy
npx cap sync
npx cap open android
