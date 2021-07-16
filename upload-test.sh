echo "Git is currently not setup for test environment"
#echo "Enter commit message: "
#read -r message
#echo "The commit message is: $message"
npm run build -- --mode testing

#git add .
#git commit -am "$message"
#git push origin master
firebase hosting:channel:deploy test --expires 7d
