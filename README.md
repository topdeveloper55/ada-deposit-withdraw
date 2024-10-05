# ada-deposit-withdraw

Write validators in the `validators` folder, and supporting functions in the `lib` folder using `.ak` as a file extension.

For example, as `validators/always_true.ak`

```gleam
validator {
  fn spend(_datum: Data, _redeemer: Data, _context: Data) -> Bool {
    True
  }
}
```

## smart contract function

A Cardano smart contract that allows users to deposit ADA into the contract and only the owner of the contract can withdraw it

## Building

```sh
aiken build
```

## Testing

To run all tests, simply do:

```sh
aiken check
```

## dependencies install

```sh
yarn install
```

## running tests by lucid

go to "src" folder and run below command:

```sh
deno run --allow-net --allow-read --allow-env generate-credential.ts
```

```sh
deno run --allow-net --allow-read --allow-env lock.ts
```

```sh
deno run --allow-net --allow-read --allow-env unlock.ts
```
