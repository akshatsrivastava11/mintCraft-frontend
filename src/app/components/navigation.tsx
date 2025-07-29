//@ts-nocheck
'use client'
import { Button } from "@/components/ui/button"
import useAppstore from "@/state/state"
import {useWallet} from '@solana/wallet-adapter-react'
import { useEffect } from "react"
import { trpc } from "../clients/trpc"
export function Navigation() {
  const {connect,select,publicKey,sendTransaction}=useWallet()

  const {wallet} =useAppstore()

    const connectWalletMutation=trpc.authRouter.connectWallet.useMutation(
      {
        onSuccess(data, variables, context) {
          console.log("wallet connected",data)
        },
        onError(error) {
          console.log("Error connecting wallet:", error);
        }
      }
    )

  const handleConnect=async()=>{
    console.log("Connecting wallet ...")

    await select('Phantom');
    await connect()
 
    console.log("Connecting wallet ...")
  }
  useEffect(()=>{
       wallet.isConnected=true
    wallet.address=publicKey
    wallet.balance=0;
    console.log("Publickey is ",publicKey?.toString())
    if(publicKey){
      (async()=>{
        
        const response=await connectWalletMutation.mutate({walletAddress:publicKey?.toString()})
        console.log("Publickey is after mutation ",publicKey)
        console.log("REsponse i s",response)
      })()
    }
  },[publicKey])
  return (
    <nav className="flex items-center justify-between p-6 bg-gray-100">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold text-black">MintCroft</h1>
        <div className="flex space-x-6">
          <button className="text-black hover:text-gray-600 font-medium">HOME</button>
          <button className="text-black hover:text-gray-600 font-medium">Agents</button>
          <button className="text-black hover:text-gray-600 font-medium">Marketplace</button>
        </div>
      </div>
      {publicKey?
      <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full" disabled>{publicKey.toBase58()}</Button>
      :
      <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full" onClick={handleConnect}>🔗 CONNECT WALLET</Button>
      }
    </nav>
  )
}
