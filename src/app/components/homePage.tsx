"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Bot,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  MessageSquare,
  Palette,
  Music,
  Code,
  ImageIcon,
  ArrowRight,
  Play,
  Crown,
  FlameIcon as Fire,
} from "lucide-react"
import { Navigation } from "./navigation"
import { Sidebar } from "./Navbar"
import { useRouter } from "next/navigation"

interface FeaturedModel {
  id: string
  name: string
  description: string
  category: "ART" | "MUSIC" | "CODE" | "WRITING"
  rating: number
  uses: number
  creator: string
  isPopular: boolean
  color: string
}

const featuredModels: FeaturedModel[] = [
  {
    id: "1",
    name: "CYBER ARTIST PRO",
    description: "CREATES STUNNING DIGITAL ART WITH FUTURISTIC VIBES",
    category: "ART",
    rating: 4.9,
    uses: 15420,
    creator: "DIGITAL_MASTER",
    isPopular: true,
    color: "bg-fuchsia-500",
  },
  {
    id: "2",
    name: "BEAT GENERATOR X",
    description: "PRODUCES ELECTRONIC MUSIC AND SOUND EFFECTS",
    category: "MUSIC",
    rating: 4.7,
    uses: 8930,
    creator: "SOUND_WIZARD",
    isPopular: false,
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "CODE ARCHITECT",
    description: "GENERATES CLEAN, OPTIMIZED CODE IN MULTIPLE LANGUAGES",
    category: "CODE",
    rating: 4.8,
    uses: 12340,
    creator: "DEV_GENIUS",
    isPopular: true,
    color: "bg-cyan-400",
  },
  {
    id: "4",
    name: "STORY WEAVER AI",
    description: "CRAFTS COMPELLING NARRATIVES AND CREATIVE CONTENT",
    category: "WRITING",
    rating: 4.6,
    uses: 6780,
    creator: "WORD_SMITH",
    isPopular: false,
    color: "bg-lime-400",
  },
]

function HomePage() {
  const router = useRouter()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ART":
        return <Palette className="w-5 h-5" />
      case "MUSIC":
        return <Music className="w-5 h-5" />
      case "CODE":
        return <Code className="w-5 h-5" />
      case "WRITING":
        return <Sparkles className="w-5 h-5" />
      default:
        return <Bot className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ART":
        return "bg-fuchsia-500 text-white"
      case "MUSIC":
        return "bg-purple-500 text-white"
      case "CODE":
        return "bg-cyan-400 text-black"
      case "WRITING":
        return "bg-lime-400 text-black"
      default:
        return "bg-gray-300 text-black"
    }
  }

  const navigateToChat = () => {
    router.push("/chat")
  }

  return (
    <div className="min-h-full bg-white/90 backdrop-blur-sm">
      <Navigation />
      <Sidebar />

      <div className="max-w-7xl mx-auto p-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="brutalist-text text-gray-600 max-w-3xl mx-auto text-lg mb-8">
            UNLEASH YOUR CREATIVITY WITH CUTTING-EDGE AI MODELS. CREATE, MINT, AND TRADE UNIQUE DIGITAL CONTENT.
          </p>
          <Button
            onClick={navigateToChat}
            className="brutalist-button-electric text-xl px-12 py-6 animate-brutalist-bounce"
          >
            <MessageSquare className="w-6 h-6 mr-3" />
            START CREATING NOW
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-lime-400 brutalist-border brutalist-shadow-lg hover:brutalist-shadow-xl transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-black brutalist-border mx-auto mb-4 flex items-center justify-center brutalist-shadow">
                <Fire className="w-6 h-6 text-lime-400" />
              </div>
              <p className="text-3xl font-black text-black mb-1">50K+</p>
              <p className="brutalist-text text-black text-sm">CREATIONS</p>
            </CardContent>
          </Card>

          <Card className="bg-fuchsia-500 brutalist-border brutalist-shadow-lg hover:brutalist-shadow-xl transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-black brutalist-border mx-auto mb-4 flex items-center justify-center brutalist-shadow">
                <Users className="w-6 h-6 text-fuchsia-500" />
              </div>
              <p className="text-3xl font-black text-white mb-1">12K+</p>
              <p className="brutalist-text text-white text-sm">CREATORS</p>
            </CardContent>
          </Card>

          <Card className="bg-cyan-400 brutalist-border brutalist-shadow-lg hover:brutalist-shadow-xl transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-black brutalist-border mx-auto mb-4 flex items-center justify-center brutalist-shadow">
                <Bot className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-3xl font-black text-black mb-1">25+</p>
              <p className="brutalist-text text-black text-sm">AI MODELS</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-400 brutalist-border brutalist-shadow-lg hover:brutalist-shadow-xl transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-black brutalist-border mx-auto mb-4 flex items-center justify-center brutalist-shadow">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-3xl font-black text-black mb-1">89%</p>
              <p className="brutalist-text text-black text-sm">SUCCESS RATE</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Models Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-500 brutalist-border brutalist-shadow-lg flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="brutalist-title text-black text-3xl">FEATURED AI MODELS</h2>
                <p className="brutalist-text text-gray-600">TOP-RATED CONTENT GENERATORS</p>
              </div>
            </div>
            <Button className="brutalist-button-cyber">
              VIEW ALL MODELS
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredModels.map((model) => (
              <Card
                key={model.id}
                className="bg-white brutalist-border brutalist-shadow-lg hover:brutalist-shadow-xl transition-all duration-200 group"
              >
                <CardHeader className="p-0">
                  <div className={`${model.color} p-6 brutalist-border-thick relative`}>
                    {model.isPopular && (
                      <Badge className="absolute top-3 right-3 bg-yellow-400 text-black brutalist-border text-xs font-black">
                        <Fire className="w-3 h-3 mr-1" />
                        HOT
                      </Badge>
                    )}
                    <div className="w-16 h-16 bg-black brutalist-border mx-auto mb-4 flex items-center justify-center brutalist-shadow">
                      {getCategoryIcon(model.category)}
                    </div>
                    <h3 className="brutalist-text text-white text-center text-sm">{model.name}</h3>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <p className="text-xs text-gray-600 font-bold mb-4 line-clamp-2">{model.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${getCategoryColor(model.category)} brutalist-border text-xs font-black`}>
                      {model.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-bold">{model.rating}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500">CREATOR</p>
                    <p className="brutalist-text text-black text-xs">{model.creator}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500">USES</p>
                      <p className="brutalist-text text-black text-sm">{model.uses.toLocaleString()}</p>
                    </div>
                    <Button onClick={navigateToChat} className="brutalist-button-electric px-4 py-2 text-xs">
                      <Play className="w-3 h-3 mr-1" />
                      TRY NOW
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white brutalist-border-thick brutalist-shadow-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="brutalist-title text-black text-3xl mb-4">QUICK ACTIONS</h2>
            <p className="brutalist-text text-gray-600">JUMP INTO CREATION MODE</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button onClick={navigateToChat} className="brutalist-button-electric p-8 h-auto flex-col space-y-4 group">
              <ImageIcon className="w-12 h-12 group-hover:animate-brutalist-bounce" />
              <div>
                <p className="brutalist-text text-lg">GENERATE IMAGE</p>
                <p className="text-xs font-bold opacity-80">CREATE STUNNING VISUALS</p>
              </div>
            </Button>

            <Button onClick={navigateToChat} className="brutalist-button-cyber p-8 h-auto flex-col space-y-4 group">
              <Music className="w-12 h-12 group-hover:animate-brutalist-bounce" />
              <div>
                <p className="brutalist-text text-lg">CREATE MUSIC</p>
                <p className="text-xs font-bold opacity-80">COMPOSE ORIGINAL TRACKS</p>
              </div>
            </Button>

            <Button onClick={navigateToChat} className="brutalist-button-danger p-8 h-auto flex-col space-y-4 group">
              <Sparkles className="w-12 h-12 group-hover:animate-brutalist-bounce" />
              <div>
                <p className="brutalist-text text-lg">WRITE CONTENT</p>
                <p className="text-xs font-bold opacity-80">CRAFT AMAZING STORIES</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-black brutalist-border-thick brutalist-shadow-xl p-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-lime-400 brutalist-border flex items-center justify-center brutalist-shadow animate-brutalist-shake">
              <Zap className="h-8 w-8 text-black" />
            </div>
            <h2 className="brutalist-title text-white text-4xl">READY TO CREATE?</h2>
            <div className="w-16 h-16 bg-fuchsia-500 brutalist-border flex items-center justify-center brutalist-shadow animate-brutalist-shake">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="brutalist-text text-lime-400 text-xl mb-8">
            JOIN THOUSANDS OF CREATORS MAKING AMAZING CONTENT WITH AI
          </p>
          <Button
            onClick={navigateToChat}
            className="brutalist-button-electric text-2xl px-16 py-8 animate-brutalist-bounce"
          >
            <MessageSquare className="w-8 h-8 mr-4" />
            START YOUR JOURNEY
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
