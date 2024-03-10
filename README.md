<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJSApiBoilerplateJWT

An API Boilerplate to create a ready-to-use REST API in seconds with NestJS 10.x and JWT Auth System :heart_eyes_cat:

## Installation

```bash
   $ pnpm install
```

## Set Environment for secret key JWT and other configurations

```bash
   $ cp .env.example .env
```

To set up on multiple environments, such as dev, stage or prod, we do as follows:

```bash
   $ cp .env.example .env.dev # or .env.stage, etc
```

## Config settings .env for sending a notification when a user registers, forgets password or changes password

```
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_AUTH_USER=[:user]
   EMAIL_AUTH_PASSWORD=[:password]
   EMAIL_DEBUG=true
   EMAIL_LOGGER=true
```

## Config settings .env to connect MySQL

Once the database has been configured, start the Nest App via `pnpm run start:dev` it automatically synchronizes the entities so it is ready to use. :heart_eyes_cat:

```
   TYPEORM_CONNECTION = "mysql"
   TYPEORM_HOST = "localhost"
   TYPEORM_PORT = 3306
   TYPEORM_USERNAME = [:user]
   TYPEORM_PASSWORD = [:password]
   TYPEORM_DATABASE = [:database]
   TYPEORM_AUTO_SCHEMA_SYNC = true
   TYPEORM_ENTITIES = "dist/**/*.entity.js"
   TYPEORM_SUBSCRIBERS = "dist/subscriber/**/*.js"
   TYPEORM_MIGRATIONS = "dist/migrations/**/*.js"
   TYPEORM_ENTITIES_DIR = "src/entity"
   TYPEORM_MIGRATIONS_DIR = "src/migration"
   TYPEORM_SUBSCRIBERS_DIR = "src/subscriber"
```

## Install TypeScript Node

```bash
   $ pnpm install -g ts-node
```

## Running migrations with typeorm

```bash
   $ ts-node node_modules/.bin/typeorm migration:run -d dist/typeorm-cli.config
```

or

```bash
   $ node_modules/.bin/typeorm migration:run -d dist/typeorm-cli.config
```

## Running the app

```bash
    # development
    $ pnpm start

    # watch mode
    $ pnpm start:dev

    # production mode
    $ pnpm start:prod
```

## Running the app in REPL mode

```bash
   $ pnpm start --entryFile repl
```

or

```bash
   $ pnpm start:repl
```

## Docker

There is a `docker-compose.yml` file for starting MySQL with Docker.

`$ docker-compose up db`

After running, you can stop the Docker container with

`$ docker-compose down`


## Url Swagger for Api Documentation

```

http://127.0.0.1:3000/docs

```
or

```

http://127.0.0.1:3000/docs-json

```
or

```

http://127.0.0.1:3000/docs-yaml

```

Configure `SWAGGER_USER` and `SWAGGER_PASSWORD` in the .env file and set `NODE_ENV` to `local` or `dev` or `staging` to access the SWAGGER(Open API) documentation with basic authentication.

```

NODE_ENV=[:enviroments]
SWAGGER_USER=[:user]
SWAGGER_PASSWORD=[:password]

````

If you want to add more environments, include them in the `SWAGGER_ENVS` array in `main.ts`, see the following:

```typescript
const SWAGGER_ENVS = ['local', 'dev', 'staging'];
````

## Configuring the NODE_API_PORT environment variable as the default port if you don't want to use the default

```
   NODE_API_PORT=3333
```

## Configuring the ENDPOINT_CORS environment variable for app frontend

```
   ENDPOINT_CORS='http://127.0.0.1:4200'
```

## Getting secure resource with Curl

```bash
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/secure  -H 'Authorization: Bearer [:token]'
```

## Generate Token JWT Authentication with Curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"email": "tony_admin@nest.com", "password": "secret"}' http://127.0.0.1:3000/api/auth/login
```

## Registration user with Curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"name": "tony", "email": "tony_admin@nest.com", "username":"tony_admin", "password": "secret"}' http://127.0.0.1:3000/api/auth/register
```

## Refresh token with curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"refreshToken": "[:token]"}' http://127.0.0.1:3000/api/auth/refresh-tokens
```

## Forgot password with curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"email": "tony_admin@nest.com"}' http://127.0.0.1:3000/api/auth/forgot-password
```

## Change password User with curl

```bash
   $ curl -H 'content-type: application/json' -v -X POST -d '{"email": "tony_admin@nest.com", "password": "secret123"}' http://127.0.0.1:3000/api/auth/change-password  -H 'Authorization: Bearer [:token]'
```

## Update profile User with curl

```bash
   $ curl -H 'content-type: application/json' -v -X PUT -d '{"name": "tony", "email": "tony_admin@nest.com", "username": "tony_admin"}' http://127.0.0.1:3000/api/users/:id/profile  -H 'Authorization: Bearer [:token]'
```

## Users list with Curl

```bash
   $ curl -H 'content-type: application/json' -H 'Accept: application/json' -v -X GET http://127.0.0.1:3000/api/users  -H 'Authorization: Bearer [:token]'
```

## User by Id with Curl

```bash
   $ curl -H 'content-type: application/json' -H 'Accept: application/json' -v -X GET http://127.0.0.1:3000/api/users/:id  -H 'Authorization: Bearer [:token]'
```

## Update User with Curl

```bash
   $ curl -H 'content-type: application/json' -v -X PUT -d '{"name": "tony", "email": "tony_admin@nest.com", "username": "tony_admin", "password":"secret"}' http://127.0.0.1:3000/api/users/:id  -H 'Authorization: Bearer [:token]'
```

## Delete User by Id with Curl

```bash
   $ curl -H 'content-type: application/json' -H 'Accept: application/json' -v -X DELETE http://127.0.0.1:3000/api/users/:id  -H 'Authorization: Bearer [:token]'
```

## License

 [MIT licensed](LICENSE)
