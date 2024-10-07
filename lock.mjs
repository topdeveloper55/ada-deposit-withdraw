import cbor from "cbor";
import {
  resolvePaymentKeyHash,
  resolvePlutusScriptAddress,
  BlockfrostProvider,
  MeshWallet,
  Transaction,
} from '@meshsdk/core';
import fs from 'node:fs';
import * as dotenv from "dotenv";
dotenv.config();
 
const blockchainProvider = new BlockfrostProvider(process.env.BLOCKFROST_PROJECT_ID);
 
const wallet_owner = new MeshWallet({
  networkId: 0,
  fetcher: blockchainProvider,
  submitter: blockchainProvider,
  key: {
    type: 'root',
    bech32: fs.readFileSync('me.sk').toString(),
  },
});

const wallet_user = new MeshWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
      type: 'root',
      bech32: fs.readFileSync('user.sk').toString(),
    },
  });
 
const blueprint = JSON.parse(fs.readFileSync('./plutus.json'));
 
const script = {
  code: cbor
    .encode(Buffer.from(blueprint.validators[0].compiledCode, "hex"))
    .toString("hex"),
  version: "V3",
};
 
const owner = resolvePaymentKeyHash((await wallet_owner.getUsedAddresses())[0]);
 
const datum = {
  value: {
    alternative: 0,
    fields: [owner],
  },
};
 
const unsignedTx = await new Transaction({ initiator: wallet_user }).sendLovelace(
  {
    address: resolvePlutusScriptAddress(script, 0),
    datum,
  },
  "5000000"
).build();
 
const signedTx = await wallet_user.signTx(unsignedTx);
 
const txHash = await wallet_user.submitTx(signedTx);
 
console.log(`1 tADA locked into the contract at:
    Tx ID: ${txHash}
    Datum: ${JSON.stringify(datum)}
`);