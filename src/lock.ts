import { Blockfrost, Constr, Data, Lucid, SpendingValidator, TxHash } from "lucid-cardano";
import * as fs from "node:fs";
import "dotenv/config";

const lucid = await Lucid.new(
  new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", process.env.BLOCKFROST_PROJECT_ID),
  "Preview"
);

lucid.selectWalletFromPrivateKey(fs.readFileSync("me.sk", "utf8"));

const validator = await readValidator();

// --- Supporting functions

async function readValidator(): Promise<SpendingValidator> {
  const validator = JSON.parse(fs.readFileSync("plutus.json", "utf8")).validators[0];
  return {
    type: "PlutusV2",
    script: validator.compiledCode,
  };
}

const publicKeyHash = lucid.utils.getAddressDetails(await lucid.wallet.address()).paymentCredential
  ?.hash;

const datum = Data.to(new Constr(0, [publicKeyHash]));

const txHash = await lock(1000000n, { into: validator, owner: datum });

await lucid.awaitTx(txHash);

console.log(`1 tADA locked into the contract at:
      Tx hash: ${txHash}
      Datum: ${datum}
  `);

// --- Supporting functions

export async function lock(
  lovelace: bigint,
  { into, owner }: { into: SpendingValidator; owner: string }
): Promise<TxHash> {
  const contractAddress = lucid.utils.validatorToAddress(into);

  const tx = await lucid
    .newTx()
    .payToContract(contractAddress, { inline: owner }, { lovelace })
    .complete();

  const signedTx = await tx.sign().complete();

  return signedTx.submit();
}
