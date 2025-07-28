//@ts-nocheck
'use client'
import { Button } from "@/components/ui/button"
import {useWallet} from '@solana/wallet-adapter-react'
export function Navigation() {
  const {connect,select,publicKey}=useWallet()
  const handleConnect=async()=>{
    console.log("Connecting wallet ...")
          // await select('Phantom');
    await select('Phantom');
    await connect()
    console.log("Connecting wallet ...")
  }
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
