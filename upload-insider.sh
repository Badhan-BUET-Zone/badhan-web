echo "Nano editor will now open. Please edit the version and then save the file"
read -n1 -s -r -p $'Press space to continue...\n' key
nano ./android/app/build.gradle
# nano ./src/plugins/android_support.ts
bin/run npm run build -- --mode insider
firebase deploy
bin/run npx cap sync
#npx cap open android
