import {create} from 'zustand'
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
    registerAiModel:async()=>{},
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