import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Gold } from "../type/gold";
import IDL from "../idl/gold.json";

// --- CONSTANTS ---

export const GOLD_PROGRAM_ID = new PublicKey(IDL.address);

// The public key of the Gold token mint
export const GOLD_MINT_PUBKEY = new PublicKey("GisyxnAFkRRd8mECKvnAmmWh7UKKmYNnp48qXbARMDiZ");

// IMPORTANT: Replace with your actual USDC mint address on Devnet/Mainnet
export const USDC_MINT_PUBKEY = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // Example Devnet USDC

// --- PDA & ACCOUNT DERIVATIONS ---

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

/**
 * Derives the address for the program's gold token vault.
 * @returns The public key of the vault token account.
 */
export const getVaultTokenAccount = (): PublicKey => {
    const goldStatePDA = getGoldStatePDA();
    return getAssociatedTokenAddressSync(GOLD_MINT_PUBKEY, goldStatePDA, true);
};

/**
 * Derives the address for the program's USDC vault.
 * @returns The public key of the vault USDC account.
 */
export const getVaultUsdcAccount = (): PublicKey => {
    const goldStatePDA = getGoldStatePDA();
    return getAssociatedTokenAddressSync(USDC_MINT_PUBKEY, goldStatePDA, true);
};

// --- INSTRUCTION FUNCTIONS ---

/**
 * Calls the 'buyGoldTokens' instruction.
 * @param program - The Anchor program instance.
 * @param usdcAmount - The amount of USDC (in its smallest unit, e.g., 1,000,000 for 1 USDC) the user wants to spend.
 * @returns The transaction signature.
 */
export const buyGoldTokens = async (
  program: Program<Gold>,
  usdcAmount: anchor.BN
): Promise<string> => {
  const buyer = program.provider.publicKey;
  if (!buyer) throw new Error("Wallet not connected.");

  const goldStatePDA = getGoldStatePDA();
  const vaultTokenAccount = getVaultTokenAccount();
  const vaultUsdcAccount = getVaultUsdcAccount();

  // Derive user's token accounts
  const buyerTokenAccount = getAssociatedTokenAddressSync(GOLD_MINT_PUBKEY, buyer);
  const buyerUsdcAccount = getAssociatedTokenAddressSync(USDC_MINT_PUBKEY, buyer);

  const tx = await program.methods
    .buyGoldTokens(usdcAmount)
    .accounts({
      goldState: goldStatePDA,
      goldMint: GOLD_MINT_PUBKEY,
      usdcMint: USDC_MINT_PUBKEY,
      vaultTokenAccount,
      vaultUsdcAccount,
      buyer,
      buyerTokenAccount,
      buyerUsdcAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .rpc();

  return tx;
};

/**
 * Calls the 'sellGoldTokens' instruction.
 * @param program - The Anchor program instance.
 * @param goldAmount - The amount of Gold tokens (in their smallest unit) the user wants to sell.
 * @returns The transaction signature.
 */
export const sellGoldTokens = async (
  program: Program<Gold>,
  goldAmount: anchor.BN
): Promise<string> => {
  const seller = program.provider.publicKey;
  if (!seller) throw new Error("Wallet not connected.");

  const goldStatePDA = getGoldStatePDA();
  const vaultTokenAccount = getVaultTokenAccount();
  const vaultUsdcAccount = getVaultUsdcAccount();

  // Derive user's token accounts
  const sellerTokenAccount = getAssociatedTokenAddressSync(GOLD_MINT_PUBKEY, seller);
  const sellerUsdcAccount = getAssociatedTokenAddressSync(USDC_MINT_PUBKEY, seller);

  const tx = await program.methods
    .sellGoldTokens(goldAmount)
    .accounts({
      goldState: goldStatePDA,
      goldMint: GOLD_MINT_PUBKEY,
      usdcMint: USDC_MINT_PUBKEY,
      vaultTokenAccount,
      vaultUsdcAccount,
      seller,
      sellerTokenAccount,
      sellerUsdcAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .rpc();

  return tx;
};

/**
 * Calls the 'redeemPhysicalGold' instruction.
 * @param program - The Anchor program instance.
 * @param goldAmount - The amount of Gold tokens to redeem for physical gold.
 * @param shippingAddress - The user's physical shipping address.
 * @returns The transaction signature.
 */
export const redeemPhysicalGold = async (
  program: Program<Gold>,
  goldAmount: anchor.BN,
  shippingAddress: string
): Promise<string> => {
  const user = program.provider.publicKey;
  if (!user) throw new Error("Wallet not connected.");

  const goldStatePDA = getGoldStatePDA();
  const userTokenAccount = getAssociatedTokenAddressSync(GOLD_MINT_PUBKEY, user);

  const tx = await program.methods
    .redeemPhysicalGold(goldAmount, shippingAddress)
    .accounts({
      goldState: goldStatePDA,
      goldMint: GOLD_MINT_PUBKEY,
      userTokenAccount,
      user,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

  return tx;
};