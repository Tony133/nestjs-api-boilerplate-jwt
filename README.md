<div align="center"> <a href="https://fastify.dev/">
    <img
      src="https://github.com/fastify/graphics/raw/HEAD/fastify-landscape-outlined.svg"
      width="650"
      height="auto"
    />
  </a>
</div>

# FastifyApiBoilerplateJWT

An API Boilerplate to create a ready-to-use REST API in seconds with Fastify + Kysely and JWT Authentication

## Installation

```sh
npm install
```

Set Environment for secret key JWT and other configurations

```sh
cp .env.example .env
```

In the project directory, you can run:

```sh
npm run dev
```

or

```sh
npm run dev:watch
```

To start the app in dev mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

```sh
npm start
```

For production mode

## Test

```sh
npm run test
```

Run the test cases

## Docker

There is a `docker-compose.yml` file for starting PostgreSQL with Docker.

```sh
docker compose up db
```

After running, you can stop the Docker container with

```sh
docker compose down
```

## Url Swagger for Api Documentation

```text
http://127.0.0.1:3000/docs
```

## License

[MIT licensed](LICENSE)
