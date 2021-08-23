# Token Sender

## Setup project

Copy `env.example.ts` to `env.ts` and fill in all the required fields.

Install dependencies:

```sh
yarn
cd client
yarn
```

Optionally install `hh`.
It is a [shorthand](https://hardhat.org/guides/shorthand.html) for `yarn hardhat`.
You can use `yarn hardhat` if you don't want to install `hh`.

## Build and deploy application to production

```sh
# generate typescript typings
hh compile
# export deployments to link it with the client
hh export --export-all client/src/deployments.json
cd client
yarn build
```

`client/dist` will be created. Deploy it to any server that can host static files.

## Run tests

```sh
hh test
```

## Deploy token sender contract

```sh
hh compile
hh --network <network> deploy
```

## Run application in dev mode

```sh
hh compile
# export deployments to link it with the client
hh export --export-all client/src/deployments.json
cd client
yarn dev
```
