import {create} from 'zustand'
import { trpc } from '@/app/clients/trpc';
import { PublicKey,VersionedTransaction,SendTransactionError } from '@solana/web3.js'
import {
  WalletSendTransactionError,
  
    type SignerWalletAdapterProps,
    type WalletAdapterProps,
   
} from '@solana/wallet-adapter-base';
import {Transaction,Connection} from '@solana/web3.js'
// import { useConnection } from '@solana/wallet-adapter-react';
const MINT_CRAFT_MODEL_REGISTRY_PROGRAM_ADDRESS="W626GLKRRbE1rPZnNgi5kHgUUfFTiyzPqdvS196NdaZ"
// const connection=useConnection()
const useAppstore=create((set,get)=>({
    wallet:{
        isConnected:false,
        address:PublicKey,
        balance:0
    },
    //Ai-models
    aiModels:{
        available:[],
        isLoading:false,
        selectedModel:null
    },
    loadAvailableModels:async ()=>{},
 
    //content-type
    createContent:async ()=>{},
    loadUserContent:async ()=>{},
    //nft
    nft:{},
    mintNft:async()=>{},
    loadUserNfts:async()=>{},
    marketplace:{},
    loadMarktetplaceListings:async()=>{},
    createListings:async()=>{},
    buyNft:async()=>{},
    loadUserListings:async()=>{},
signingTransaction: async (
  signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined,
  sendTransaction: WalletAdapterProps['sendTransaction'],
  connection: ConnectionContextState,
  TransactionSig: string,
) => {
  try {
    const txBuffer = Buffer.from(TransactionSig, 'base64')
    const transaction = VersionedTransaction.deserialize(txBuffer)
    transaction.message.recentBlockhash = await (await connection.connection.getLatestBlockhash()).blockhash
    // transaction.addSignature(get().wallet.publicKey, Buffer.from(TransactionSig, 'base64'))
    // console.log(transaction.message.getAccountKeys().compileInstructions);
    const accountKeys = transaction.message.getAccountKeys().staticAccountKeys; // PublicKey[]
const instructions = transaction.message.compiledInstructions; // CompiledInstruction[]
for (const ix of instructions) {
  const programId = accountKeys[ix.programIdIndex];
  console.log("🔍 Instruction targeting program:", programId.toBase58());
}
    // console.log("Trnasaction is  ",transaction.)
    console.log("The cluster is ",connection.connection.rpcEndpoint)
    if (signTransaction) {

        // transaction.

      const signedTx = await signTransaction(transaction)
      console.log("signedTx is  ",signedTx)
      // signedTx.message.recentBlockhash=(await connection.connection.getLatestBlockhash()).blockhash
      const sig = await connection.connection.sendRawTransaction(signedTx.serialize())
      console.log("Submitted tx signature:", sig)
      
      
      await connection.connection.confirmTransaction(sig, 'processed')
    return sig
    }
  } catch (err) {
if(err instanceof SendTransactionError){
            console.log("send transaction errors :", (await err.getLogs(new Connection("https://api.devnet.solana.com"))));

            console.log("send transaction errors :", (await err.getLogs(new Connection("https://api.devnet.solana.com")))[6]);
            console.log("send transaction errors :", (await err.getLogs(new Connection("https://api.devnet.solana.com")))[8]);

        }
  console.error("Signing or sending transaction failed:", err);
  }
}

}))

export default useAppstore;

export interface ConnectionContextState {
    connection: Connection;
}