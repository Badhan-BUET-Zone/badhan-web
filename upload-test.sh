git checkout test-branch
echo "Enter commit message: "
read -r message
echo "The commit message is: $message"
git add .
git commit -am "$message"
git push origin test-branch
