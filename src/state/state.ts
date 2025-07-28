import {create} from 'zustand'
import { trpc } from '@/app/clients/trpc';
const useAppstore=create((set)=>({
    wallet:{
        isConnected:false,
        address:null,
        balance:0
    },
    connectWallet:async(walletAdapter)=>{
        try {
            await walletAdapter.connect();
            set({
                wallet:{
                    isConnected:true,
                    address:walletAdapter.publicKey.toString(),
                    balance:await walletAdapter.getBalance()
                }
            })
        } catch (error) {
            console.log("Error connecting wallet:",error)
        }
    },
    disconnectWallet:async(walletAdapter)=>{
        set({
            wallet:{
                isConnected:false,
                address:null,
                balance:0
            }
        })
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
        
        const response=await trpc.aiModelRouter.register.mutate({
            apiEndpoint,
            description,
            name,
            royaltyPerGeneration
        })
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

}))

export default useAppstore;