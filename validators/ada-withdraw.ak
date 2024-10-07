use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use aiken/primitive/string
use cardano/transaction.{OutputReference, Transaction}
 
pub type Datum {
  owner: VerificationKeyHash,
}
 
pub type Redeemer {
  msg: ByteArray,
}
 
validator ada_withdraw {
  spend(
    datum: Option<Datum>,
    redeemer: Redeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
 
    expect Some(Datum { owner }) = datum
 
    let must_be_signed = list.has(self.extra_signatories, owner)
 
    must_be_signed?
  }
}

// ...rest of the code is unchanged
 
test ada_withdraw_example() {
  let datum =
    Datum { owner: #"00000000000000000000000000000000000000000000000000000000" }
 
  let redeemer = Redeemer { msg: "" }
 
  let placeholder_utxo = OutputReference { transaction_id: "", output_index: 0 }
 
  ada_withdraw.spend(
    Some(datum),
    redeemer,
    placeholder_utxo,
    Transaction { ..transaction.placeholder, extra_signatories: [datum.owner] },
  )
}