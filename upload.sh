git checkout master
git merge test-branch
echo "Enter commit message: "
read -r message
echo "The commit message is: $message"
npm run build
npx cap sync
git add .
git commit -am "$message"
git push origin master
firebase deploy
git checkout test-branch
cd ../secrets
bash ./push.sh
