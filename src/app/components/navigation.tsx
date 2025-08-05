//@ts-nocheck
"use client"
import { Button } from "@/components/ui/button"
import useAppstore from "@/state/state"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect } from "react"
import { trpc } from "../clients/trpc"
import { Wallet, Home, Bot, ShoppingBag, Square } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export function Navigation() {
  const { connect, select, publicKey, sendTransaction, disconnect } = useWallet()
  const router = useRouter()
  const pathname = usePathname()

  const { wallet } = useAppstore()

  const connectWalletMutation = trpc.authRouter.connectWallet.useMutation({
    onSuccess(data) {
      console.log("wallet connected", data)
    },
    onError(error) {
      console.log("Error connecting wallet:", error)
    },
  })

  const handleConnect = async () => {
    console.log("Connecting wallet ...")
    await select("Phantom")
    await connect()
    // console.log("Connecting wallet ...")
  }

  useEffect(() => {
    wallet.isConnected = true
    wallet.address = publicKey
    wallet.balance = 0
    console.log("Publickey is ", publicKey?.toString())
    if (publicKey) {
      ;(async () => {
        console.log("Publickey is before mutation ", publicKey)
        const response = await connectWalletMutation.mutate({ walletAddress: publicKey?.toString() })
        console.log("Publickey is after mutation ", publicKey)
        console.log("REsponse i s", response)
      })()
    }
  }, [publicKey])

  const hanldeDisconnect = async () => {
    await disconnect()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white/95 backdrop-blur-sm brutalist-border-thick brutalist-shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/home" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black brutalist-border flex items-center justify-center brutalist-shadow">
                <Square className="w-6 h-6 text-lime-400 fill-current" />
              </div>
              <h1 className="brutalist-title text-black">MINTCRAFT</h1>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link href="/home">
                <Button className={`${isActive("/home") ? "brutalist-button-electric" : "brutalist-button"}`}>
                  <Home className="w-5 h-5 mr-2" />
                  HOME
                </Button>
              </Link>
              <Link href="/chat">
                <Button className={`${isActive("/chat") ? "brutalist-button-electric" : "brutalist-button"}`}>
                  <Bot className="w-5 h-5 mr-2" />
                  CHAT
                </Button>
              </Link>
              <Link href="/developers">
                <Button className={`${isActive("/developers") ? "brutalist-button-electric" : "brutalist-button"}`}>
                  <Bot className="w-5 h-5 mr-2" />
                  AGENTS
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button className={`${isActive("/marketplace") ? "brutalist-button-electric" : "brutalist-button"}`}>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  MARKET
                </Button>
              </Link>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {publicKey && (
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-lime-400 brutalist-border brutalist-shadow">
                <div className="w-3 h-3 bg-black animate-pulse"></div>
                <span className="brutalist-text text-black text-sm">
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </span>
              </div>
            )}

            {publicKey ? (
              <Button className="brutalist-button-danger" onClick={hanldeDisconnect}>
                <Wallet className="w-5 h-5 mr-2" />
                DISCONNECT
              </Button>
            ) : (
              <Button className="brutalist-button-electric" onClick={handleConnect}>
                <Wallet className="w-5 h-5 mr-2" />
                CONNECT WALLET
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
