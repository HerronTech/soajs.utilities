#!/usr/bin/env bash


function program_is_installed {
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  type $1 >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
}
echo $'Initializing and checking prerequisites ... '
PRE_EXIT=0
_SW_CHECK=$(program_is_installed node)
if [ ${_SW_CHECK} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install node!'
    PRE_EXIT=1
fi
_SW_CHECK=$(program_is_installed mongo)
if [ ${_SW_CHECK} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install mongo!'
    PRE_EXIT=1
fi
_SW_CHECK=$(program_is_installed nginx)
if [ ${_SW_CHECK} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install nginx!'
    PRE_EXIT=1
fi
_SW_CHECK=$(program_is_installed npm)
if [ ${_SW_CHECK} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install npm!'
    PRE_EXIT=1
fi

if [ ${PRE_EXIT} == 1 ]; then
    exit -1
fi

mongo --eval "db.stats()"
RESULT=$?
if [ $RESULT -ne 0 ]; then
    echo $'\n ...mongodb not running'
    exit -1
else
    echo $'\n mongodb running! continue...'
fi

echo $'\n1- Importing core provisioned data ...'
node index data import provision
echo $'\n2- Importing URAC data...'
node index data import urac
echo $'\n--------------------------'



echo "DONE"