#!/bin/bash

# ###### FUNCTIONS ######
function echo_pass() {
  printf "\e[32m✔ ${1}"
  printf "\033\e[0m"
}

function echo_done() {
  printf "\e[32m✨  ${1}"
  printf "\033\e[0m"
}

# ###### EXECUTES ######
SECONDS=0
# 1. clone submodule zoobc-language-files
git clone git@github.com:zoobc/zoobc-language-files.git

# 2. copy repo zoobc-language-files
if [ -d "./src/assets/languages/locales" ]; then
  rm -rf "./src/assets/languages/locales"
fi

mkdir -p "./src/assets/languages"
cp -R ./zoobc-language-files/locales ./src/assets/languages/locales/
rm -rf "./zoobc-language-files"

# 3. finish
duration=$SECONDS
echo -e "\n$(echo_done) Done in $(($duration % 60)) seconds."
