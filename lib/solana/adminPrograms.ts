import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID,getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Gold } from "../type/gold"; 
import IDL from "../idl/gold.json";
import { DEFAULT_PUSH_ORACLE_PROGRAM_ID } from "@pythnetwork/pyth-solana-receiver/lib/address";

export const GOLD_PROGRAM_ID = new PublicKey(IDL.address);


export const GOLD_MINT_PUBKEY = new PublicKey("GisyxnAFkRRd8mECKvnAmmWh7UKKmYNnp48qXbARMDiZ");

const GOLD_USD_PRICE_FEED_ID = "0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2";



/**
 * Finds the Program Derived Address (PDA) for the main gold_state account.
 * @returns The public key of the gold_state PDA.
 */
export const getGoldStatePDA = (): PublicKey => {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("gold_state")],
    GOLD_PROGRAM_ID
  );
  return pda;
};


export const getVaultTokenAccount = (): PublicKey => {
    const goldStatePDA = getGoldStatePDA();
    return getAssociatedTokenAddressSync(GOLD_MINT_PUBKEY, goldStatePDA, true);
};

/**
 * Finds the Pyth price feed account address.
 * @param provider - An AnchorProvider instance from your component.
 * @returns The public key of the Pyth price feed account.
 */
export const getPythPriceFeedAccount = (): PublicKey => {
  // Convert your price feed ID to a Buffer (32 bytes)
  const priceFeedId = Buffer.from(GOLD_USD_PRICE_FEED_ID.replace(/^0x/, ""), "hex");
  const shardId = 0;
  const shardBuffer = Buffer.alloc(2);
  shardBuffer.writeUInt16LE(shardId, 0);
  const [pda] = PublicKey.findProgramAddressSync(
    [shardBuffer, priceFeedId],
    DEFAULT_PUSH_ORACLE_PROGRAM_ID
  );
  return pda;
};



/**
 * Calls the 'initialize' instruction on the Gold smart contract.
 * @param program - The Anchor program instance created in your component.
 * @param oracleAuthority - The public key designated to update the price.
 * @param custodyProvider - A string identifying the custody provider.
 * @returns The transaction signature.
 */
export const initializeProtocol = async (
  program: Program<Gold>,
  oracleAuthority: PublicKey,
  custodyProvider: string
): Promise<string> => {
  const goldStatePDA = getGoldStatePDA();

  const authority = program.provider.publicKey;

  if (!authority) {
    throw new Error("Wallet not connected to the provider.");
  }

  const tx = await program.methods
    .initialize(oracleAuthority, custodyProvider)
    .accounts({
      // @ts-expect-error: Anchor typegen issue
      goldState: goldStatePDA,
      goldMint: GOLD_MINT_PUBKEY,
      authority,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID
    })
    .rpc();

  return tx;
};

/**
 * Calls the 'updateGoldPrice' instruction on the Gold smart contract.
 * The connected wallet MUST be the designated oracleAuthority.
 * @param program - The Anchor program instance created in your component.
 * @returns The transaction signature.
 */
export const updateGoldPrice = async (
  program: Program<Gold>
): Promise<string> => {
  const goldStatePDA = getGoldStatePDA();
  const priceFeedAccount = getPythPriceFeedAccount();
  const oracleAuthority = program.provider.publicKey;

  if (!oracleAuthority) {
    throw new Error("Wallet not connected to the provider.");
  }

  const tx = await program.methods
    .updateGoldPrice()
    .accounts({
      goldState: goldStatePDA,
      // @ts-expect-error: Anchor typegen issue
      oracleAuthority,
      priceUpdate: priceFeedAccount
    })
    .rpc();
    console.log("Update Gold Price transaction signature", tx);
    const state = await program.account.goldState.fetch(goldStatePDA);
    console.log("Gold Token Price:", state.goldPriceUsd.toString());
  return tx;
};

export const mintGoldPrice = async (
  program : Program<Gold>,
  amountToMint : anchor.BN,
  custodyReceipt: string,
): Promise<string> => {
  const goldStatePDA = getGoldStatePDA();
  const goldMint = GOLD_MINT_PUBKEY;
  const vaultTokenAccount = getVaultTokenAccount();

  const tx = await program.methods
    .mintGoldTokens(amountToMint, custodyReceipt)
    .accounts({
      goldState: goldStatePDA,
      goldMint,
      vaultTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .rpc();

  console.log("Mint Gold Tokens transaction signature", tx);
  return tx;
};



/**
 * Fetches the current gold state from the blockchain.
 * @param program - The Anchor program instance created in your component.
 * @returns The gold state account data.
 */
export const fetchGoldState = async (program: Program<Gold>) => {
  const goldStatePDA = getGoldStatePDA();
  const goldState = await program.account.goldState.fetch(goldStatePDA);
  return goldState;
};

/**
 * Checks if the protocol has been initialized by trying to fetch its state.
 * @param program - The Anchor program instance.
 * @returns A boolean indicating if the protocol is initialized.
 */
export const isProtocolInitialized = async (program: Program<Gold>): Promise<boolean> => {
  try {
    await fetchGoldState(program);
    return true;
  } catch (error) {
  
    return false;
  }
};