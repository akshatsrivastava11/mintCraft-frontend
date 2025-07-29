import {create} from 'zustand'
import { trpc } from '@/app/clients/trpc';
import { PublicKey,VersionedTransaction } from '@solana/web3.js';
import { error } from 'console';

import {
    type SignerWalletAdapterProps,
    type WalletAdapterProps,
   
} from '@solana/wallet-adapter-base';
import {Transaction,Connection} from '@solana/web3.js'
// import { useConnection } from '@solana/wallet-adapter-react';
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
    registerAiModel:async(apiEndpoint:string,
            description:string,
            name:string,
            royaltyPerGeneration:number,)=>{
    try {
        let wallet=get().wallet;
        console.log("wallet i s",wallet)
        const mutation= trpc.aiModelRouter.register.useMutation({
            onSuccess:(data)=> {
                console.log("registration initilized",data)

            },
            onError:(error)=>{
                console.log("Error registering AI model:",error)

            }
        })
        const response=await mutation.mutate({apiEndpoint,description,name,royaltyPerGeneration})

        console.log(response)
        return response
    } catch (error) {
        console.log("Error registering AI model:",error)
        
    }
    },
    confirmRegisterAiModel:async(pendingRegistrationId:number,
                transactionSignature:string)=>{
        try {

            const response=await trpc.aiModelRouter.confirmRegistration.mutate({
                pendingRegistrationId,
                transactionSignature
            })
            console.log(response)
            return response
        } catch (error) {
            console.log("Error confirming AI model registration:",error)
        }
    },
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
  TransactionSig: string
) => {
  try {
    const txBuffer = Buffer.from(TransactionSig, 'base64')
    const transaction = VersionedTransaction.deserialize(txBuffer)

    if (signTransaction) {
      const signedTx = await signTransaction(transaction)
      const sig = await connection.connection.sendRawTransaction(signedTx.serialize())
      console.log("Submitted tx signature:", sig)
      await connection.connection.confirmTransaction(sig, 'processed')
    }
  } catch (err) {
    console.error("Signing or sending transaction failed:", err)
  }
}

}))

export default useAppstore;

export interface ConnectionContextState {
    connection: Connection;
}