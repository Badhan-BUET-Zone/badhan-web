git checkout test-branch
echo "Enter commit message: "
read -r message
echo "The commit message is: $message"
git add .
git commit -am "$message"
git push origin test-branch
npm run build -- --mode testing
firebase hosting:channel:deploy test --expires 30d
rm -r ./dist
