# NestJSApiBoilerplateJWT

An API Boilerplate to create a ready-to-use REST API in seconds with NestJS 8.x and Passport Auth JWT System :heart_eyes_cat:

## Installation

```bash
   $ npm install
```

## Set Enviroment for secret key JWT and other configurations

```bash
   $ cp .env.example .env
```

To set up on multiple environments, such as dev, stage or prod, we do as follows:

```bash
   $ cp .env.example .env.dev # or .env.stage, etc
```

## Config settings .env for send notification when a user registers, forgot password or change password

```
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_AUTH_USER=[:user]
   EMAIL_AUTH_PASSWORD=[:password]
   EMAIL_DEBUG=true
   EMAIL_LOGGER=true
   EMAIL_LAYOUT_DIR='templates/emails/'
   EMAIL_PARTIAL_DIR='templates/emails/'
   EMAIL_VIEW_PATH='/templates/emails/'
   EMAIL_DEFAULT_LAYOUT='index'
```

## Config settings ormconfig.json for connect MySQL
Once the database has been configured, start the Nest App via ```npm run start:dev``` it automatically synchronizes the entities so ready to use. :heart_eyes_cat:

```
{
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "my_user",
    "password": "my_password",
    "database": "my_database",
    "synchronize": true,
    "logging": false,
    "entities": [
       "dist/**/*.entity.js"
    ],
    "migrations": [
       "dist/migrations/**/*.js"
    ],
    "subscribers": [
       "dist/subscriber/**/*.js"
    ],
    "cli": {
       "migrationsDir": "src/migrations",
       "subscribersDir": "src/subscriber"
    }
 }
```

## Install TypeScript Node

```bash
   $ npm install -g ts-node
```

## Running migrations with typeorm

```bash
   $ ts-node node_modules/.bin/typeorm migration:run
```

or

```bash
   $ node_modules/.bin/typeorm migration:run
```

## Running the app

```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
```

## Docker

There is a `docker-compose.yml` file for starting MySQL with Docker.

`$ docker-compose up`

After running, you can stop the Docker container with

`$ docker-compose down`


## Url Swagger for Api Documentation
```
http://127.0.0.1:3000/api/doc
```

## Getting secure resource with Curl

```bash
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/secure  -H 'Authorization: Bearer [:token]'
```

## Generate Token JWT Authentication with Curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"email": "tony_admin@nest.it", "password": "secret"}' http://127.0.0.1:3000/api/auth/login

```

## Registration user with Curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"name": "tony", "email": "tony_admin@nest.it", "username":"tony_admin", "password": "secret"}' http://127.0.0.1:3000/api/auth/register

```

## Forgot password with curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"email": "tony_admin@nest.it"}' http://127.0.0.1:3000/api/auth/forgot-password
```

## Change password User with curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"email": "tony_admin@nest.it", "password": "secret123"}' http://127.0.0.1:3000/api/auth/change-password  -H 'Authorization: Bearer [:token]'
```

## Update profile User with curl

```bash
   $ curl -H 'content-type: application/json' -v -X PUT -d '{"name": "tony", "email": "tony_admin@nest.it", "username": "tony_admin"}' http://127.0.0.1:3000/api/users/:id/profile  -H 'Authorization: Bearer [:token]'
```
