git checkout test-branch
echo "Enter commit message: "
read -r message
echo "The commit message is: $message"
npm run build -- --mode testing

git add .
git commit -am "$message"
git push origin test-branch
firebase hosting:channel:deploy test --expires 30d
