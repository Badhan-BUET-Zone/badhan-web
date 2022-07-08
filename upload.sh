git checkout master
git merge test-branch
echo "Enter commit message: "
read -r message
echo "The commit message is: $message"
git add .
git commit -am "$message"
git push origin master
npm run build
npx cap sync
firebase deploy
rm -r ./dist
git checkout test-branch
