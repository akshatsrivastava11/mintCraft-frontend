"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Power } from "lucide-react"
import { Navigation } from "./navigation"

interface UserModel {
  id: string
  name: string
  createdAt: string
  status: "active" | "training" | "inactive"
  type: string
}

function CreateModel() {
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
    // Simulate model creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    //checks if the api_endpoint is valid
    const newModelData: UserModel = {
      id: Date.now().toString(),
      name: newModel.name,
      createdAt: new Date().toISOString().split("T")[0],
      status: "training",
      type: "custom",
    }

    setUserModels((prev) => [newModelData, ...prev])
    setNewModel("")
    setShowCreateForm(false)
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
    <div className="min-h-screen bg-gray-200">
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
                    disabled={!newModel.name.trim() || isCreating}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Agent"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="border-black text-black hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Models List */}
        <div className="max-w-2xl mx-auto space-y-4">
          {userModels.length > 0 ? (
            userModels.map((model) => (
              <Card
                key={model.id}
                className="border-2 border-black bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
                      <Power className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-lg">{model.name}</h3>
                      <p className="text-gray-600 text-sm">{model.type}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          model.status === "active"
                            ? "bg-green-100 text-green-800"
                            : model.status === "training"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {model.status}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-300 rounded mx-auto mb-4 flex items-center justify-center">
                <Power className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Agents Yet</h3>
              <p className="text-gray-500 mb-4">Create your first AI agent to get started</p>
              <Button onClick={() => setShowCreateForm(true)} className="bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Agent
              </Button>
            </div>
          )}
        </div>

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
