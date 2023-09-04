#!/bin/sh
umask 000

if test ! -d ./node_modules || [ "$IS_CI" = "1" ]; then
    echo "Installing node modules"
    if test ! -f ./package-lock.json; then
        npm i || exit 1;
    else
        npm ci || exit 1; 
    fi;
else
    echo "Node modules directory already exsist, skipping 'npm i'"
fi;

# Waiting for Backend
if [ "$IS_CI" = "1" ]; then
    while ! curl zizle-backend-app:${BACKEND_APP_PORT} > /dev/null 2>&1; do sleep 1; done
fi;

npm run $@