---
layout: page
path: /postgraphile/running-postgraphile-in-docker/
title: Running PostGraphile in Docker
---

All the files created in this guide are available in the repository [Postgraphile-in-Docker](https://github.com/alexisrolland/postgraphile-in-docker).

The following guide describes how to run a network of Docker containers on a local machine, including one container for a PostgreSQL database and one container for PostGraphile. This requires to have Docker and Docker Compose installed on your workstation. If you are new to Docker and need to install it, you can refer to their [official documentation](https://docs.docker.com/). Note if you use Docker Desktop for Windows, it comes automatically with Docker Compose.

# Table of Contents

-   Create PostgreSQL Container
    -   Setup Environment Variables
    -   Create Database Initialization Files
    -   Create PostgreSQL Dockerfile
    -   Create Docker Compose File
-   Create PostGraphile Container
    -   Update Environment Variables
    -   Create PostGraphile Dockerfile
    -   Update Docker Compose File
-   Build Images And Run Containers
    -   Build Images
    -   Run Containers

# Create PostgreSQL Container

## Setup Environment Variables

Create a new file `.env` at the root of the repository with the content below. This file will be used by Docker to load configuration parameters into environment variables. In particular:

-   `POSTGRES_DB`: name of the database to be created in the PostgreSQL container.
-   `POSTGRES_USER`: default admin user created upon database initialization.
-   `POSTGRES_PASSWORD`: password of the default admin user.

```
# DB
# Parameters used by db container
POSTGRES_DB=forum_example
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_me
```

Note a better way to manager the database password would be to use [Docker Secrets](https://docs.docker.com/engine/reference/commandline/secret/)

## Create Database Initialization Files

Create a new folder `db` at the root of the repository. It will be used to store the files necessary to create the PostgreSQL container. In the `db` folder, create a new subfolder `init` which will contain the SQL files used to initialize the PostgreSQL database.

Files located in the `init` folder will be executed in sequence order when PostgreSQL initialize the database. In this guide we will use a simple forum example. Create a first file `00-database.sql` containing the database schema definition.

```sql
\connect forum_example;

/*Create user table in public schema*/
CREATE TABLE public.user (
    id SERIAL PRIMARY KEY,
    username TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE public.user IS
'Forum users.';

/*Create post table in public schema*/
CREATE TABLE public.post (
    id SERIAL PRIMARY KEY,
    title TEXT,
    body TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER NOT NULL REFERENCES public.user(id)
);

COMMENT ON TABLE public.post IS
'Forum posts written by a user.';
```

For the sake of the example, we will also create a second file `01-data.sql` to populate the database with some dummy data.

```sql
\connect forum_example;

/*Create some dummy users*/
INSERT INTO public.user (username) VALUES
('Benjie'),
('Singingwolfboy'),
('Lexius');

/*Create some dummy posts*/
INSERT INTO public.post (title, body, author_id) VALUES
('First post example', 'Lorem ipsum dolor sit amet', 1),
('Second post example', 'Consectetur adipiscing elit', 2),
('Third post example', 'Aenean blandit felis sodales', 3);
```

## Create PostgreSQL Dockerfile

The Dockerfile is used by Docker as a blueprint to build Docker images. Docker containers are later on created based on these Docker images. More information is available on the official [Postgres Docker Images](https://hub.docker.com/_/postgres) but the standard Dockerfile for PostgreSQL is extremely simple. In the folder `db` (not in the folder `init`), create a new file named `Dockerfile` with the following content.

```dockerfile
FROM postgres:alpine
COPY ./init/ /docker-entrypoint-initdb.d/
```

The first line `FROM postgres:alpine` indicates to build the Docker image based on the official PostgreSQL Docker image running in an Alpine Linux container. The second line `COPY ./init/ /docker-entrypoint-initdb.d/` will copy the database initialization files (SQL) into the folder `docker-entrypoint-initdb.d` located in the Docker container. This folder is read by PostgreSQL upon database initialization and all its content is executed.

## Create Docker Compose File

Docker command lines can be verbose with a lot of parameters so we will use Docker Compose to orchestrate the execution of our containers. Create a new file `docker-compose.yml` at the root of the repository with the following content.

```yml
version: "3.3"
services:
    db:
        container_name: forum-example-db
        restart: always
        image: forum-example-db
        build:
            context: ./db
        volumes:
            - db:/var/lib/postgresql/data
        env_file:
            - ./.env
        networks:
            - network
        ports:
            - 5432:5432

networks:
    network:

volumes:
    db:
```

At this stage, the repository should look like this.

```
/
├─ db/
|  ├─ init/
|  |  ├─ 00-database.sql
|  |  └─ 01-data.sql
|  └─ Dockerfile
├─ .env
└─ docker-compose.yml
```

# Create PostGraphile Container

## Update Environment Variables

Update the file `.env` to add the `DATABASE_URL` which will be used by PostGraphile to connect to the PostgreSQL database. Note the `DATABASE_URL` follows the syntax `postgres://<user>:<password>@db:5432/<db_name>`.

```
[...]
# GRAPHQL
# Parameters used by graphql container
DATABASE_URL=postgres://postgres:change_me@db:5432/forum_example
```

## Create PostGraphile Dockerfile

Create a new folder `graphql` at the root of the repository. It will be used to store the files necessary to create the PostGraphile container. Create a new file `Dockerfile` in the `graphql` folder with the following content. You will notice we include the excellent plugin Connection Filter.

```dockerfile
FROM node:alpine
LABEL description="Instant high-performance GraphQL API for your PostgreSQL database https://github.com/graphile/postgraphile"

# Install PostGraphile and PostGraphile connection filter plugin
RUN npm install -g postgraphile
RUN npm install -g postgraphile-plugin-connection-filter

EXPOSE 5000
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]
```

## Update Docker Compose File

Update the file `docker-compose.yml` under the `services` section to include the GraphQL service.

```yml
version: "3.3"
services:
    db: [...]

    graphql:
        container_name: forum-example-graphql
        restart: always
        image: forum-example-graphql
        build:
            context: ./graphql
        env_file:
            - ./.env
        depends_on:
            - db
        networks:
            - network
        ports:
            - 5433:5433
        command: ["--connection", "${DATABASE_URL}", "--port", "5433", "--schema", "public", "--append-plugins", "postgraphile-plugin-connection-filter"]
[...]
```

At this stage, the repository should look like this.

```
/
├─ db/
|  ├─ init/
|  |  ├─ 00-database.sql
|  |  └─ 01-data.sql
|  └─ Dockerfile
├─ graphql/
|  └─ Dockerfile
├─ .env
└─ docker-compose.yml
```

# Build Images And Run Containers

## Build Images

You can build the Docker images by executing the following command from the root of the repository.

```
# Build all images in docker compose
$ docker-compose build

# Build database image only
$ docker-compose build db

# Build graphql image only
$ docker-compose build graphql
```

## Run Containers

You can run the Docker containers by executing the following command from the root of the repository.

```
# Run all containers
$ docker-compose up

# Run all containers as daemon (in background)
$ docker-compose up -d

# Run database container as daemon
$ docker-compose up -d db

# Run graphql container as daemon
$ docker-compose up -d graphql
```

Each container can be accessed at the following addresses. Note if you run Docker Toolbox on Windows Home, you can get your Docker machine IP address with the command `$ docker-machine ip default`.

<table>
    <tr>
        <th>Container</th>
        <th>Docker on Linux / Windows Pro</th>
        <th>Docker on Windows Home</th>
    </tr>
    <tr>
        <td>GraphQL API Documentation</td>
        <td>https://localhost:5433/graphiql</td>
        <td>https://your_docker_machine_ip:5433/graphiql</td>
    </tr>
    <tr>
        <td>GraphQL API</td>
        <td>https://localhost:5433/graphql</td>
        <td>https://your_docker_machine_ip:5433/graphql</td>
    </tr>
    <tr>
        <td>PostgreSQL Database</td>
        <td>host: localhost, port: 5432</td>
        <td>host: your_docker_machine_ip, port: 5432</td>
    </tr>
</table>
