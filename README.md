# M326 - Quiz Applikation

In this setup we will setup Chakra UI with Remix.

Please note that when adding Chakra UI to a TypeScript project, a minimum TypeScript version of `4.1.0` is required

## Development

1. Install Dependencies

    ```sh
    npm i
    ```

2. Configure the Environment (`.env`)

    ```sh
    echo 'DATABASE_URL="file:./data.db?connection_limit=1"' > .env
    ```

3. Start Development Server

    ```sh
    npm run dev
    ```

### Prisma Schema Change

1. Start Postgres Dev Db

    ```sh
    docker compose -f docker-compose.dev.yml up
    ```

2. Run migration command

    ```sh
    npx prisma migrate dev
    ```

## Integration

1. Run the thing

    ```sh
    docker compose -f docker-compose.int.yml up
    ```

## Production

1. Build Image

    ```sh
    docker build -t 3n3a/trivia-game:1.0.1 .
    ```

2. Publish Image to Docker Hub

    ```sh
    docker push 3n3a/trivia-game:1.0.1
    ```

3. Configure the Environment

    ```sh
    echo "DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>" > .env.prod
    ```

4. Run the App

    ```sh
    docker compose up -d
    ```

## Related Links

* [Chakra UI](https://chakra-ui.com/guides/getting-started/remix-guide)
* [Todo List](./TODO.md)
