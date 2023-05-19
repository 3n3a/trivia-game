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

### Integration DockerCompose

1. Run the thing

    ```sh
    docker compose -f docker-compose.int.yml up
    ```

### Production DockerCompose

1. Configure the Environment

    ```sh
    echo "DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>" > .env.prod
    ```

2. Run the App

    ```sh
    docker compose up -d
    ```

## Related Links

* [Chakra UI](https://chakra-ui.com/guides/getting-started/remix-guide)
* [Todo List](./TODO.md)
