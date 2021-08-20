# Token Sender

## Setup project

```sh
yarn
cd client
yarn
```

`hh` is a [shorthand](https://hardhat.org/guides/shorthand.html) for `yarn hardhat`.

## Run tests

```sh
hh test
```

## Deploy token sender contract

```sh
hh compile
hh --network <network> deploy
```

## Run application

```sh
# export deployments to link it with the client
hh export --export-all client/src/deployments.json
cd client
yarn dev
```
