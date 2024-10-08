import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getNetworkUrl } from '../utils/network';
import { magic } from '../config/magic';

export interface TransactionResult {
  signature: string;
  explorerUrl: string;
}

const RPC_URL = getNetworkUrl();

export async function signAndSendTransaction(
  userPublicAddress: string,
  instructions: TransactionInstruction[],
  connection?: Connection
): Promise<TransactionResult> {
  const conn = connection || new Connection(RPC_URL);
  const userPublicKey = new PublicKey(userPublicAddress);

  const transaction = new Transaction().add(...instructions);

  const blockhash = await conn.getLatestBlockhash();
  transaction.recentBlockhash = blockhash.blockhash;
  transaction.feePayer = userPublicKey;

  const signedTransaction = await magic.solana.signTransaction(
    transaction,
    {
      requireAllSignatures: false,
      verifySignatures: true,
    }
  );

  const signature = await conn.sendRawTransaction(
    Buffer.from(signedTransaction.rawTransaction as string, "base64")
  );

  const explorerUrl = getBlockExplorer(signature);

  return { signature, explorerUrl };
}


function getBlockExplorer(signature: string): string {
  // Implement your getBlockExplorer logic here
  return `https://solana.fm/tx/${signature}?cluster=devnet-alpha`;
}

// Helper function to create a transfer instruction
export function createTransferInstruction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number
): TransactionInstruction {
  return SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports,
  });
}