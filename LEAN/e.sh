clear
echo '------------BOOT SECTOR------------'
echo ''
node ./util/start.js
read choice
if [[ $choice -eq 1 ]]
then  
  npx nodemon index.js
fi
if [[ $choice -eq 2 ]]
then  
clear 
 node index.js
fi

if [[ $choice < 2 ]] 
then 
echo "Please Specify A Option!"
fi