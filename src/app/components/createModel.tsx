//@ts-nocheck
"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Power } from "lucide-react"
import { Navigation } from "./navigation"
import DataTableDemo from "@/components/ui/DataTableDemo"
import useAppstore from "@/state/state"
import { trpc } from "../clients/trpc"
import { useWallet,useConnection } from "@solana/wallet-adapter-react"
// import { useConnection } from "@solana/wallet-adapter-react"
interface UserModel {
  id: string
  name: string
  createdAt: string
  status: "active" | "training" | "inactive"
  type: string
}

function CreateModel() {
  const connection=useConnection()
  const {signTransaction,sendTransaction}=useWallet()
  const {signingTransaction}=useAppstore()
  const [userModels, setUserModels] = useState<UserModel[]>([])
  const [newModel, setNewModel] = useState({
    royalty: "",
    apiEndpoint: "",
    description: "",
    name: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const registerMutation = trpc.aiModelRouter.register.useMutation({
    onSuccess: (data) => {
      console.log('AI Model registered:', data.serializedTransaction);
      
      // Add the new model to the list after successful registration
      const newModelData: UserModel = {
        id: Date.now().toString(),
        name: newModel.name,
        createdAt: new Date().toISOString().split("T")[0],
        status: "training",
        type: "custom",
      }
      
      setUserModels((prev) => [newModelData, ...prev])
      setNewModel({
        royalty: "",
        apiEndpoint: "",
        description: "",
        name: ""
      })
      setShowCreateForm(false)
      setIsCreating(false)
      return data
    },
    onError: (err) => {
      console.error('Failed to register model:', err.message);
      setIsCreating(false)
    },
  });

  const fetchUserModels = async () => {
    console.log("Fetching user models from the DB...")
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data matching the minimal design
    const mockData: UserModel[] = [
      {
        id: "1",
        name: "AI Agent-1",
        createdAt: "2024-01-15",
        status: "active",
        type: "royalty",
      },
      {
        id: "2",
        name: "AI Agent-2",
        createdAt: "2024-01-10",
        status: "training",
        type: "trading",
      },
      {
        id: "3",
        name: "AI Agent-3",
        createdAt: "2024-01-05",
        status: "inactive",
        type: "analytics",
      },
    ]

    setUserModels(mockData)
    setIsLoading(false)
  }

  const handleCreateModel = async () => {
    if (!newModel.name.trim()) return

    setIsCreating(true)
    
    // Simulate model creation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
//signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined,sendTransaction: WalletAdapterProps['sendTransaction'],connection:ConnectionContextState,TransactionSig:string
    // Use the mutation - this will trigger onSuccess or onError callbacks
    const response = await registerMutation.mutateAsync({
      apiEndpoint: "ccfec",
      description: "frerf",
      name: "fvvr",
      royaltyPerGeneration:4
    })
    
    console.log("REsponse is ",response)
    console.log("response is ", response.serializedTransaction)
    await signingTransaction(signTransaction,sendTransaction,connection,response.serializedTransaction)
    setIsCreating(false)
  }

  useEffect(() => {
    fetchUserModels()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200">
        <Navigation />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#948979]">
      <Navigation />

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-2">Your AI Creations</h1>
        </div>

        {/* Create Model Form */}
        {showCreateForm && (
          <div className="max-w-md mx-auto mb-8">
            <Card className="border-2 border-black bg-white">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black">Create New Agent</h3>
                <Input
                  placeholder="Enter agent name..."
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  className="border-gray-300 focus:border-black"
                />
                <Input
                  placeholder="Enter royalty_percent..."
                  value={newModel.royalty}
                  onChange={(e) => setNewModel({...newModel, royalty: e.target.value })}
                  className="border-gray-300 focus:border-black"
                />
                <Input
                  placeholder="Enter api endpoint..."
                  value={newModel.apiEndpoint}
                  onChange={(e) => setNewModel({...newModel, apiEndpoint: e.target.value })}
                  className="border-gray-300 focus:border-black"
                />
                <Input
                  placeholder="Enter agent description..."
                  value={newModel.description}
                  onChange={(e) => setNewModel({...newModel, description: e.target.value })}
                  className="border-gray-300 focus:border-black"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateModel}
                    disabled={!newModel.name.trim() || isCreating || registerMutation.isPending}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {isCreating || registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Agent"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowCreateForm(false)}
                    className="border-black text-black hover:bg-gray-100"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <DataTableDemo/>

        {/* Floating Add Button */}
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default CreateModel