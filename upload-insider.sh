# echo "Nano editor will now open. Please edit the version and then save the file"
# read -n1 -s -r -p $'Press space to continue...\n' key
# nano ./android/app/build.gradle
# nano ./src/plugins/android_support.ts
npm run build -- --mode insider
#firebase deploy
npx cap sync
# npx cap open android
