//@ts-nocheck
"use client"
import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Bot, User, Zap, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { trpc } from "../clients/trpc"
import useAppstore from "@/state/state"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
}

type getAllModels =
  | {
      id: number
      ownerId: number
      name: string
      description: string
      royaltyPercentage: number
      apiEndpoint: string
      headersJSONstring: string
      isActive: boolean
      createdAt: string
      updatedAt: string
      aiModelPublicKey: string
      owner: {
        wallet: string
        id: number
      }
    }[]
  | undefined

function ChatPart() {
    const connection = useConnection
    ()
    // const {wallet}=useWallet()
  const initializeUserConfig=trpc.contentRouter.initilizeUserConfig.useMutation(
    {
      onSuccess(data) {
        console.log("User config initialized", data)
      },
      onError(error) {
        console.error("Error initializing user config:", error)
      },
    }
  )
  // initializeUserConfig.mutateAsync
  const { data, error } = trpc.aiModelRouter.getAll.useQuery()
  const { signTransaction, sendTransaction,publicKey } = useWallet()
  const { signingTransaction } = useAppstore()
  useEffect(() => {
    if (data) {
      console.log("data is", data)
    }
  }, [data])

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAImodel, setSelectedAImodel] = useState<number | null>(null)
  const [allModels, setallModels] = useState<getAllModels>([
    {
      owner: {
        wallet: "",
        id: 1,
      },
      id: 101,
      ownerId: 1,
      name: "POSEIDON-GPT",
      description: "OCEANIC DATA ANALYSIS POWERHOUSE",
      royaltyPercentage: 10,
      apiEndpoint: "https://api.example.com/poseidon-gpt",
      headersJSONstring: JSON.stringify({
        Authorization: "Bearer DEMO_TOKEN",
        "Content-Type": "application/json",
      }),
      isActive: true,
      createdAt: "",
      updatedAt: "",
      aiModelPublicKey: "7gF7KsE9qRXUEqJvK5JpZVcNxkzzbTTbv6XUc6PKcPvZ",
    },
  ])

  const contentGenerationMutation = trpc.contentRouter.generate.useMutation({
    onSuccess: (data) => {
      console.log("content generation response is", data)
    },
    onError: (error) => {
      console.log("Error generating content:", error)
    },
  })

  const confirmcontentGeneration = trpc.contentRouter.confirmContentSubmission.useMutation({
    onSuccess: (data) => {
      console.log("content generation response is", data)
    },
    onError: (error) => {
      console.log("Error generating content:", error)
    },
  })
  const mintingNftMutation = trpc.contentRouter.mintAsNft.useMutation({
    onSuccess: (data) => {
      console.log("NFT minting response is", data)
      setIsLoading(false)
      setIsTyping(false)
    },
    onError: (error) => {
      console.log("Error minting NFT:", error)
      setIsLoading(false)
      setIsTyping(false)
    },
  })
  const confirmMintingNft = trpc.contentRouter.confirmNFTSubmission.useMutation({
    onSuccess: (data) => {
      console.log("NFT minting confirmation response is", data)
    },
    onError: (error) => {
      console.log("Error confirming NFT minting:", error)
    },
  })

  useEffect(() => {
    if (data) {
      const x = data
      console.log(x)
      setallModels(x)
    }
  }, [data])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: "YO! I'M YOUR AI ASSISTANT. READY TO CREATE SOME SICK CONTENT?",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages([welcomeMessage])
  }, [])

  const handleSendMessage = async () => {
    const response1=await initializeUserConfig.mutateAsync()
    console.log("User config is ", response1)

     if(!response1.serializedTransaction){
      console.error("Account already initialized, skipping transaction signing")
    }
    else{
       const responseSigned1 = await signingTransaction(
      signTransaction,
      sendTransaction,
      connection,
      response1.serializedTransaction,
      publicKey?.toString()
    )
    console.log("Response signed is ", responseSigned1)
  }
    if (!newMessage.trim()) return
    console.log(newMessage)
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    if (!allModels) {
      return
    }
    const aiModelUsed = allModels.find((model) => model.id === selectedAImodel)
    if (!aiModelUsed) {
      return
    }
    const response = await contentGenerationMutation.mutateAsync({
      aiModelId: aiModelUsed.id,
      prompt: "Generate an image of a cat riding a horse with  a rainbow in the background and a unicorn flying in the sky and a dragon breathing fire",
      contentType: "image",
    description: "NFTDESCRIPTIONisYesNOPLEASE",
name: "NFTNAMEisYEsNOPLEASE",
    })
    if (!response.success) {
      console.log("error generating content", response)
      return
    }
    console.log(response.message)
    
    console.log("Response from the content generation is", response)
    const sig=await signingTransaction(signTransaction,sendTransaction,connection,response.serializedTransaction,publicKey?.toString())
    if(sig){
      console.log("Signature is ",sig)
      console.log("THe respone was ",response)
      const confirmResponse = await confirmcontentGeneration.mutateAsync({
        transactionSignature: sig,
        pendingContentId:response.pendingContentId,
      })
      console.log("Confirm response is ", confirmResponse)
      if (confirmResponse.success) {
        console.log("Content confirmed successfully")
        const nftMintedResponse = await mintingNftMutation.mutateAsync({
          contentId:confirmResponse.content.id,
          name:"NFTNAME",
          royaltyPercentage:3,
          symbol:"NFTSYMBOL",
        })
        console.log("NFT Minted Response is ", nftMintedResponse)
        if (nftMintedResponse.success) { 
        const signature= await signingTransaction(signTransaction,sendTransaction,connection,nftMintedResponse.serializedTransaction,publicKey?.toString())
        if(signature){
          console.log("NFT Minted Signature is ", signature)
          const confirmNftResponse = await confirmMintingNft.mutateAsync({
            transactionSignature: signature,
            pendingNftId:nftMintedResponse.pendingNftId,
          })
          console.log("Confirm NFT Response is ", confirmNftResponse)
          if (confirmNftResponse.success) {
            console.log("NFT confirmed successfully")
          } else {
            console.error("Error confirming NFT:", confirmNftResponse.message)
          }
        }
    }
  }
  }
    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectedModel = allModels?.find((model) => model.id === selectedAImodel)

  return (
    <div className="flex-1 flex flex-col h-full bg-white/90 backdrop-blur-sm">
      {/* Chat Header */}
      <div className="bg-white brutalist-border-thick brutalist-shadow py-4 px-6 pl-50 ml-300">
        <div className="flex items-center justify-between">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="brutalist-button-cyber">
                <Bot className="w-4 h-4 mr-2" />
                {selectedModel ? selectedModel.name : "SELECT MODEL"}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white brutalist-border brutalist-shadow">
              <DropdownMenuLabel className="brutalist-text text-black p-4">CHOOSE AI MODEL</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup value={position} onValueChange={(val) => setSelectedAImodel(Number(val))}>
                  {allModels &&
                    allModels.map((model) => (
                      <DropdownMenuRadioItem
                        key={model.id}
                        value={String(model.id)}
                        className="hover:bg-lime-400 p-4 brutalist-text"
                      >
                        <div className="flex flex-col">
                          <span className="font-black text-black">{model.name}</span>
                          <span className="text-xs text-gray-600 font-bold">{model.description}</span>
                        </div>
                      </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/80 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 bg-lime-400 brutalist-border brutalist-shadow-xl mx-auto mb-6 flex items-center justify-center">
                <Zap className="h-12 w-12 text-black" />
              </div>
              <h3 className="brutalist-title text-black mb-4">START CREATING</h3>
              <p className="brutalist-text text-gray-600 max-w-md">
                SEND A MESSAGE TO BEGIN YOUR AI-POWERED CONTENT CREATION
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <div className="w-12 h-12 bg-fuchsia-500 brutalist-border flex items-center justify-center flex-shrink-0 brutalist-shadow">
                  <Bot className="h-6 w-6 text-white" />
                </div>
              )}

              <Card
                className={`max-w-[75%] brutalist-border ${
                  message.sender === "user"
                    ? "bg-black text-white brutalist-shadow-electric"
                    : "bg-white text-black brutalist-shadow-cyber"
                }`}
              >
                <CardContent className="p-4">
                  <p className="font-bold leading-relaxed mb-2">{message.content}</p>
                  <p
                    className={`text-xs brutalist-text ${message.sender === "user" ? "text-lime-400" : "text-gray-500"}`}
                  >
                    {message.timestamp}
                  </p>
                </CardContent>
              </Card>

              {message.sender === "user" && (
                <div className="w-12 h-12 bg-black brutalist-border flex items-center justify-center flex-shrink-0 brutalist-shadow">
                  <User className="h-6 w-6 text-lime-400" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="w-12 h-12 bg-fuchsia-500 brutalist-border flex items-center justify-center flex-shrink-0 brutalist-shadow">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <Card className="bg-white brutalist-border brutalist-shadow-warning">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-black animate-bounce"></div>
                    <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="brutalist-text text-black">AI IS THINKING...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white/95 backdrop-blur-sm brutalist-border-thick brutalist-shadow-lg p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="TYPE YOUR MESSAGE..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="brutalist-input text-lg py-4 px-4 font-bold placeholder:font-black placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading || !selectedAImodel}
              className="brutalist-button-electric px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </Button>
          </div>

          {!selectedAImodel && (
            <p className="brutalist-text text-red-500 mt-4 text-center">SELECT AN AI MODEL TO START CHATTING!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPart
