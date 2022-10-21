# The https://graphile.org/ website for PostGraphile and Graphile Engine

## Building

```bash
yarn install --force # Because we sometimes get issues with sharp
yarn run develop
```

## View in Browser

You can view the website in browser at http://localhost:8000/

## Troubleshooting

Use node 12

```bash
nvm use 12
```

Gatsby sometimes goes wrong/gets confused. First port of call is to kill it,
then clear the `.cache` and `public` folders:

```bash
rm -Rf .cache public
```

Requires Node version 14

```bash
nvm use 14
```

If you are running Windows and encounter an error installing `fsevents`, then
try:

```bash
yarn install --ignore-optional --force
```
