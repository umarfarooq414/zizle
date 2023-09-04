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

# Waiting for DB
# echo "Waiting for postgres (${ASP_POSTGRES_HOST}:${ASP_POSTGRES_PORT:-5432})..."
# sh -c "while ! nc -z ${ASP_POSTGRES_HOST} ${ASP_POSTGRES_PORT:-5432}; do sleep 1; done;" &> /dev/null

npm run $@
