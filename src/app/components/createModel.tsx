//@ts-nocheck
"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Bot, Zap, Settings, Square } from "lucide-react"
import { Navigation } from "./navigation"
import DataTableDemo from "@/components/ui/DataTableDemo"
import useAppstore from "@/state/state"
import { trpc } from "../clients/trpc"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

interface UserModel {
  id: string
  name: string
  createdAt: string
  status: "active" | "training" | "inactive"
  type: string
}

function CreateModel() {
  const connection = useConnection()
  const { signTransaction, sendTransaction } = useWallet()
  const { signingTransaction } = useAppstore()
  const [userModels, setUserModels] = useState<UserModel[]>([])
  const [newModel, setNewModel] = useState({
    royalty: "",
    apiEndpoint: "",
    description: "",
    name: "",
    headerJSONstring: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const registerMutation = trpc.aiModelRouter.register.useMutation({
    onSuccess: (data) => {
      console.log("AI Model registered:", data.serializedTransaction)

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
        name: "",
        headerJSONstring: "",
      })
      setShowCreateForm(false)
      setIsCreating(false)
      return data
    },
    onError: (err) => {
      console.error("Failed to register model:", err.message)
      setIsCreating(false)
    },
  })

  const confirmRegisterMutation = trpc.aiModelRouter.confirmRegistration.useMutation({
    onSuccess: (data) => {
      console.log("AI Model registration confirmed:", data)
    },
    onError: (err) => {
      console.error("Failed to confirm model registration:", err.message)
    },
  })

  const fetchUserModels = async () => {
    console.log("Fetching user models from the DB...")
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockData: UserModel[] = [
      {
        id: "1",
        name: "CREATIVE WRITER AI",
        createdAt: "2024-01-15",
        status: "active",
        type: "CONTENT",
      },
      {
        id: "2",
        name: "IMAGE GENERATOR PRO",
        createdAt: "2024-01-10",
        status: "training",
        type: "VISUAL",
      },
      {
        id: "3",
        name: "CODE ASSISTANT",
        createdAt: "2024-01-05",
        status: "inactive",
        type: "DEVELOPMENT",
      },
    ]

    setUserModels(mockData)
    setIsLoading(false)
  }

  const handleCreateModel = async () => {
    if (!newModel.name.trim()) return

    setIsCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const response = await registerMutation.mutateAsync({
      apiEndpoint: "https://router.huggingface.co/nebius/v1/images/generations",
      description: "This AIMODEL is used to generate images",
      name: "NebiusForDemo",
      royaltyPerGeneration: 3,
      headersJSONstring: String(`{
				Authorization: Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY},
				"Content-Type": "application/json",
			}`),
    })

    console.log("REsponse is ", response)
    console.log("response is ", response.serializedTransaction)
    const responseSigned = await signingTransaction(
      signTransaction,
      sendTransaction,
      connection,
      response.serializedTransaction,
    )

    if (!responseSigned) {
      console.log("An error ocurred while signing transaction")
    }
    const data = await confirmRegisterMutation.mutateAsync({
      pendingRegistrationId: response.pendingRegistrationId,
      transactionSignature: responseSigned,
    })
    console.log(data)
    setIsCreating(false)
  }

  useEffect(() => {
    fetchUserModels()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        <Navigation />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-fuchsia-500 brutalist-border brutalist-shadow-xl mx-auto mb-4 flex items-center justify-center animate-brutalist-shake">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <p className="brutalist-text text-black">LOADING YOUR AI MODELS...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white/90 backdrop-blur-sm">
      <Navigation />

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-lime-400 brutalist-border brutalist-shadow-xl flex items-center justify-center">
              <Bot className="h-8 w-8 text-black" />
            </div>
            <h1 className="brutalist-title text-black">YOUR AI ARSENAL</h1>
          </div>
          <p className="brutalist-text text-gray-600 max-w-2xl mx-auto">
            CREATE, MANAGE, AND DEPLOY POWERFUL AI MODELS FOR CONTENT GENERATION
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-lime-400 brutalist-border brutalist-shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-black brutalist-border flex items-center justify-center brutalist-shadow">
                  <Zap className="w-7 h-7 text-lime-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-black">
                    {userModels.filter((m) => m.status === "active").length}
                  </p>
                  <p className="brutalist-text text-black text-sm">ACTIVE MODELS</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-400 brutalist-border brutalist-shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-black brutalist-border flex items-center justify-center brutalist-shadow">
                  <Settings className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-black">
                    {userModels.filter((m) => m.status === "training").length}
                  </p>
                  <p className="brutalist-text text-black text-sm">TRAINING</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-fuchsia-500 brutalist-border brutalist-shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-black brutalist-border flex items-center justify-center brutalist-shadow">
                  <Square className="w-7 h-7 text-fuchsia-500 fill-current" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{userModels.length}</p>
                  <p className="brutalist-text text-white text-sm">TOTAL MODELS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Model Form */}
        {showCreateForm && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-white brutalist-border-thick brutalist-shadow-xl">
              <CardHeader className="bg-cyan-400 brutalist-border-thick">
                <CardTitle className="brutalist-subtitle text-black flex items-center space-x-3">
                  <Bot className="w-6 h-6" />
                  <span>CREATE NEW AI MODEL</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="MODEL NAME..."
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    className="brutalist-input font-bold"
                  />
                  <Input
                    placeholder="ROYALTY PERCENTAGE..."
                    value={newModel.royalty}
                    onChange={(e) => setNewModel({ ...newModel, royalty: e.target.value })}
                    className="brutalist-input font-bold"
                  />
                </div>

                <Input
                  placeholder="API ENDPOINT..."
                  value={newModel.apiEndpoint}
                  onChange={(e) => setNewModel({ ...newModel, apiEndpoint: e.target.value })}
                  className="brutalist-input font-bold"
                />

                <Input
                  placeholder="DESCRIPTION..."
                  value={newModel.description}
                  onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                  className="brutalist-input font-bold"
                />

                <Input
                  placeholder="HEADERS JSON STRING..."
                  value={newModel.headerJSONstring}
                  onChange={(e) => setNewModel({ ...newModel, headerJSONstring: e.target.value })}
                  className="brutalist-input font-bold"
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleCreateModel}
                    disabled={!newModel.name.trim() || isCreating || registerMutation.isPending}
                    className="brutalist-button-electric flex-1 py-3"
                  >
                    {isCreating || registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        CREATING MODEL...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        CREATE MODEL
                      </>
                    )}
                  </Button>
                  <Button onClick={() => setShowCreateForm(false)} className="brutalist-button-danger">
                    CANCEL
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Models Table */}
        <div className="bg-white brutalist-border-thick brutalist-shadow-xl p-8">
          <DataTableDemo />
        </div>

        {/* Floating Add Button */}
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="fixed bottom-8 right-8 w-20 h-20 brutalist-button-electric text-2xl z-50 animate-brutalist-bounce"
        >
          <Plus className="h-10 w-10" />
        </Button>
      </div>
    </div>
  )
}

export default CreateModel
