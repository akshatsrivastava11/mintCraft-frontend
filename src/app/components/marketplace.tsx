"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  ShoppingCart,
  Zap,
  TrendingUp,
  Eye,
  Heart,
  ChevronDown,
  Coins,
  Star,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Navigation } from "./navigation"
import { showToast } from "@/lib/toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Toaster } from "react-hot-toast"
import { useWallet } from "@solana/wallet-adapter-react"

interface NFTListing {
  id: string
  name: string
  description: string
  price: number
  currency: "SOL" | "USDC"
  image: string
  creator: string
  owner: string
  category: "ART" | "MUSIC" | "GAMING" | "UTILITY" | "COLLECTIBLE"
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY"
  likes: number
  views: number
  isLiked: boolean
  createdAt: string
  isAvailable: boolean
}

const mockNFTs: NFTListing[] = [
  {
    id: "1",
    name: "CYBER PUNK WARRIOR",
    description: "FUTURISTIC WARRIOR FROM THE DIGITAL REALM",
    price: 2.5,
    currency: "SOL",
    image: "/placeholder.svg?height=300&width=300",
    creator: "DIGITAL_ARTIST_01",
    owner: "COLLECTOR_ALPHA",
    category: "ART",
    rarity: "LEGENDARY",
    likes: 234,
    views: 1420,
    isLiked: false,
    createdAt: "2024-01-15",
    isAvailable: true,
  },
  {
    id: "2",
    name: "NEON CITY NIGHTS",
    description: "VIBRANT CITYSCAPE WITH ELECTRIC VIBES",
    price: 1.8,
    currency: "SOL",
    image: "/placeholder.svg?height=300&width=300",
    creator: "URBAN_CREATOR",
    owner: "NIGHT_TRADER",
    category: "ART",
    rarity: "EPIC",
    likes: 156,
    views: 890,
    isLiked: true,
    createdAt: "2024-01-12",
    isAvailable: true,
  },
  {
    id: "3",
    name: "BASS DROP BEATS",
    description: "ELECTRONIC MUSIC NFT WITH EXCLUSIVE RIGHTS",
    price: 0.75,
    currency: "SOL",
    image: "/placeholder.svg?height=300&width=300",
    creator: "BEAT_MASTER",
    owner: "MUSIC_LOVER",
    category: "MUSIC",
    rarity: "RARE",
    likes: 89,
    views: 445,
    isLiked: false,
    createdAt: "2024-01-10",
    isAvailable: false,
  },
  {
    id: "4",
    name: "PIXEL SWORD LEGENDARY",
    description: "RARE GAMING WEAPON WITH SPECIAL ABILITIES",
    price: 3.2,
    currency: "SOL",
    image: "/placeholder.svg?height=300&width=300",
    creator: "GAME_FORGE",
    owner: "PIXEL_WARRIOR",
    category: "GAMING",
    rarity: "LEGENDARY",
    likes: 312,
    views: 2100,
    isLiked: true,
    createdAt: "2024-01-08",
    isAvailable: true,
  },
  {
    id: "5",
    name: "UTILITY TOKEN ACCESS",
    description: "EXCLUSIVE ACCESS TO PREMIUM FEATURES",
    price: 150,
    currency: "USDC",
    image: "/placeholder.svg?height=300&width=300",
    creator: "UTILITY_LABS",
    owner: "ACCESS_HOLDER",
    category: "UTILITY",
    rarity: "COMMON",
    likes: 67,
    views: 234,
    isLiked: false,
    createdAt: "2024-01-05",
    isAvailable: true,
  },
  {
    id: "6",
    name: "RETRO ROBOT COLLECTION",
    description: "VINTAGE ROBOT FROM THE CLASSIC SERIES",
    price: 1.2,
    currency: "SOL",
    image: "/placeholder.svg?height=300&width=300",
    creator: "RETRO_STUDIO",
    owner: "ROBOT_FAN",
    category: "COLLECTIBLE",
    rarity: "RARE",
    likes: 178,
    views: 756,
    isLiked: false,
    createdAt: "2024-01-03",
    isAvailable: true,
  },
]

function MarketplacePage() {
  const { connected, publicKey } = useWallet()
  const [nfts, setNfts] = useState<NFTListing[]>([])
  const [filteredNfts, setFilteredNfts] = useState<NFTListing[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [selectedRarity, setSelectedRarity] = useState<string>("ALL")
  const [sortBy, setSortBy] = useState<string>("NEWEST")
  const [priceRange, setPriceRange] = useState<string>("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [purchasingNfts, setPurchasingNfts] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const categories = ["ALL", "ART", "MUSIC", "GAMING", "UTILITY", "COLLECTIBLE"]
  const rarities = ["ALL", "COMMON", "RARE", "EPIC", "LEGENDARY"]
  const sortOptions = ["NEWEST", "OLDEST", "PRICE_LOW", "PRICE_HIGH", "MOST_LIKED"]
  const priceRanges = ["ALL", "UNDER_1", "1_TO_5", "OVER_5"]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY":
        return "bg-yellow-400 text-black"
      case "EPIC":
        return "bg-fuchsia-500 text-white"
      case "RARE":
        return "bg-cyan-400 text-black"
      case "COMMON":
        return "bg-gray-300 text-black"
      default:
        return "bg-gray-300 text-black"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ART":
        return "bg-lime-400 text-black"
      case "MUSIC":
        return "bg-purple-500 text-white"
      case "GAMING":
        return "bg-red-500 text-white"
      case "UTILITY":
        return "bg-blue-500 text-white"
      case "COLLECTIBLE":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-300 text-black"
    }
  }

  const handleLike = async (nftId: string) => {
    if (!connected) {
      showToast.error("Connect your wallet to like NFTs!")
      return
    }

    try {
      setNfts((prev) =>
        prev.map((nft) =>
          nft.id === nftId
            ? {
                ...nft,
                isLiked: !nft.isLiked,
                likes: nft.isLiked ? nft.likes - 1 : nft.likes + 1,
              }
            : nft,
        ),
      )

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      showToast.success("Preference updated!")
    } catch (error) {
      console.error("Error updating like:", error)
      showToast.error("Failed to update preference")

      // Revert the change
      setNfts((prev) =>
        prev.map((nft) =>
          nft.id === nftId
            ? {
                ...nft,
                isLiked: !nft.isLiked,
                likes: nft.isLiked ? nft.likes + 1 : nft.likes - 1,
              }
            : nft,
        ),
      )
    }
  }

  const handleBuy = async (nftId: string) => {
    if (!connected) {
      showToast.error("Connect your wallet to purchase NFTs!")
      return
    }

    const nft = nfts.find((n) => n.id === nftId)
    if (!nft) {
      showToast.error("NFT not found!")
      return
    }

    if (!nft.isAvailable) {
      showToast.error("This NFT is no longer available!")
      return
    }

    setPurchasingNfts((prev) => new Set(prev).add(nftId))

    try {
      await showToast.promise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.2) {
              resolve(true)
            } else {
              reject(new Error("Transaction failed"))
            }
          }, 3000)
        }),
        {
          loading: `Purchasing ${nft.name}...`,
          success: `🎉 Successfully purchased ${nft.name}!`,
          error: "Purchase failed. Please try again.",
        },
      )

      // Update NFT availability
      setNfts((prev) =>
        prev.map((n) =>
          n.id === nftId ? { ...n, isAvailable: false, owner: publicKey?.toString().slice(0, 8) + "..." || "You" } : n,
        ),
      )
    } catch (error: any) {
      console.error("Purchase error:", error)
    } finally {
      setPurchasingNfts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(nftId)
        return newSet
      })
    }
  }

  const loadNFTs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate occasional network error
      if (Math.random() < 0.1) {
        throw new Error("Network error: Unable to load NFTs")
      }

      setNfts(mockNFTs)
      showToast.success("NFTs loaded successfully!")
    } catch (error: any) {
      console.error("Error loading NFTs:", error)
      setError(error.message)
      showToast.error("Failed to load NFTs")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNFTs()
  }, [])

  useEffect(() => {
    let filtered = [...nfts]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.creator.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter((nft) => nft.category === selectedCategory)
    }

    // Rarity filter
    if (selectedRarity !== "ALL") {
      filtered = filtered.filter((nft) => nft.rarity === selectedRarity)
    }

    // Price range filter
    if (priceRange !== "ALL") {
      switch (priceRange) {
        case "UNDER_1":
          filtered = filtered.filter((nft) => nft.price < 1)
          break
        case "1_TO_5":
          filtered = filtered.filter((nft) => nft.price >= 1 && nft.price <= 5)
          break
        case "OVER_5":
          filtered = filtered.filter((nft) => nft.price > 5)
          break
      }
    }

    // Sort
    switch (sortBy) {
      case "NEWEST":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "OLDEST":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "PRICE_LOW":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "PRICE_HIGH":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "MOST_LIKED":
        filtered.sort((a, b) => b.likes - a.likes)
        break
    }

    setFilteredNfts(filtered)
  }, [nfts, searchQuery, selectedCategory, selectedRarity, sortBy, priceRange])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        <Navigation />
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" text="LOADING MARKETPLACE..." />
        </div>
      </div>
    )
  }

  if (error && nfts.length === 0) {
    return (
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <Card className="bg-red-500 brutalist-border-thick brutalist-shadow-xl max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-black brutalist-border mx-auto mb-6 flex items-center justify-center brutalist-shadow">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="brutalist-title text-white text-2xl mb-4">MARKETPLACE ERROR!</h2>
              <p className="brutalist-text text-white text-sm mb-6">{error}</p>
              <Button onClick={loadNFTs} className="brutalist-button-electric w-full">
                TRY AGAIN
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        <Toaster />
        <Navigation />

        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-fuchsia-500 brutalist-border brutalist-shadow-xl flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h1 className="brutalist-title text-black">NFT MARKETPLACE</h1>
            </div>
            <p className="brutalist-text text-gray-600 max-w-2xl mx-auto">
              DISCOVER, COLLECT, AND TRADE UNIQUE DIGITAL ASSETS
            </p>
          </div>

          {/* Connection Status */}
          {!connected && (
            <div className="bg-yellow-400 brutalist-border-thick brutalist-shadow-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <AlertCircle className="w-6 h-6 text-black" />
                <p className="brutalist-text text-black">CONNECT YOUR WALLET TO PURCHASE NFTS!</p>
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-lime-400 brutalist-border brutalist-shadow hover:brutalist-shadow-lg transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-black brutalist-border mx-auto mb-2 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-lime-400" />
                </div>
                <p className="text-2xl font-black text-black">{nfts.length}</p>
                <p className="brutalist-text text-black text-xs">TOTAL NFTS</p>
              </CardContent>
            </Card>

            <Card className="bg-cyan-400 brutalist-border brutalist-shadow hover:brutalist-shadow-lg transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-black brutalist-border mx-auto mb-2 flex items-center justify-center">
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-black">{new Set(nfts.map((n) => n.creator)).size}</p>
                <p className="brutalist-text text-black text-xs">CREATORS</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-400 brutalist-border brutalist-shadow hover:brutalist-shadow-lg transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-black brutalist-border mx-auto mb-2 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-2xl font-black text-black">
                  {nfts.reduce((sum, nft) => sum + nft.price, 0).toFixed(1)}
                </p>
                <p className="brutalist-text text-black text-xs">SOL VOLUME</p>
              </CardContent>
            </Card>

            <Card className="bg-red-500 brutalist-border brutalist-shadow hover:brutalist-shadow-lg transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-black brutalist-border mx-auto mb-2 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-2xl font-black text-white">{nfts.filter((n) => n.isAvailable).length}</p>
                <p className="brutalist-text text-white text-xs">AVAILABLE</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="bg-white brutalist-border-thick brutalist-shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                  <Input
                    placeholder="SEARCH NFTS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 brutalist-input font-bold"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="brutalist-button-electric w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    {selectedCategory}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white brutalist-border brutalist-shadow">
                  <DropdownMenuLabel className="brutalist-text text-black">CATEGORY</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                    {categories.map((category) => (
                      <DropdownMenuRadioItem
                        key={category}
                        value={category}
                        className="hover:bg-lime-400 brutalist-text"
                      >
                        {category}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Rarity Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="brutalist-button-cyber w-full">
                    <Star className="w-4 h-4 mr-2" />
                    {selectedRarity}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white brutalist-border brutalist-shadow">
                  <DropdownMenuLabel className="brutalist-text text-black">RARITY</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={selectedRarity} onValueChange={setSelectedRarity}>
                    {rarities.map((rarity) => (
                      <DropdownMenuRadioItem key={rarity} value={rarity} className="hover:bg-lime-400 brutalist-text">
                        {rarity}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Price Range */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="brutalist-button w-full">
                    <Coins className="w-4 h-4 mr-2" />
                    PRICE
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white brutalist-border brutalist-shadow">
                  <DropdownMenuLabel className="brutalist-text text-black">PRICE RANGE</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={priceRange} onValueChange={setPriceRange}>
                    <DropdownMenuRadioItem value="ALL" className="hover:bg-lime-400 brutalist-text">
                      ALL PRICES
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="UNDER_1" className="hover:bg-lime-400 brutalist-text">
                      UNDER 1 SOL
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1_TO_5" className="hover:bg-lime-400 brutalist-text">
                      1-5 SOL
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="OVER_5" className="hover:bg-lime-400 brutalist-text">
                      OVER 5 SOL
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="brutalist-button-danger w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    SORT
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white brutalist-border brutalist-shadow">
                  <DropdownMenuLabel className="brutalist-text text-black">SORT BY</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    {sortOptions.map((option) => (
                      <DropdownMenuRadioItem key={option} value={option} className="hover:bg-lime-400 brutalist-text">
                        {option.replace("_", " ")}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="brutalist-text text-black">
              SHOWING {filteredNfts.length} OF {nfts.length} NFTS
            </p>
            <Button onClick={loadNFTs} className="brutalist-button-cyber" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              REFRESH
            </Button>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNfts.map((nft) => (
              <Card
                key={nft.id}
                className="bg-white brutalist-border brutalist-shadow-lg hover:brutalist-shadow-xl transition-all duration-200 group"
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full h-48 object-cover brutalist-border-thick"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={`${getRarityColor(nft.rarity)} brutalist-border text-xs font-black`}>
                        {nft.rarity}
                      </Badge>
                      <Badge className={`${getCategoryColor(nft.category)} brutalist-border text-xs font-black`}>
                        {nft.category}
                      </Badge>
                    </div>
                    <Button
                      size="icon"
                      onClick={() => handleLike(nft.id)}
                      className={`absolute top-3 right-3 w-8 h-8 ${
                        nft.isLiked ? "brutalist-button-danger" : "brutalist-button"
                      }`}
                      disabled={!connected}
                    >
                      <Heart className={`w-4 h-4 ${nft.isLiked ? "fill-current" : ""}`} />
                    </Button>

                    {/* Availability overlay */}
                    {!nft.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-red-500 text-white brutalist-border font-black">SOLD OUT</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="brutalist-text text-black text-sm mb-1">{nft.name}</h3>
                    <p className="text-xs text-gray-600 font-bold line-clamp-2">{nft.description}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-500">CREATOR</p>
                    <p className="brutalist-text text-black text-xs">{nft.creator}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span className="text-xs font-bold">{nft.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-gray-500" />
                        <span className="text-xs font-bold">{nft.views}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500">PRICE</p>
                      <p className="brutalist-text text-black">
                        {nft.price} {nft.currency}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleBuy(nft.id)}
                      className="brutalist-button-electric px-4 py-2 text-xs"
                      disabled={!connected || !nft.isAvailable || purchasingNfts.has(nft.id)}
                    >
                      {purchasingNfts.has(nft.id) ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : !nft.isAvailable ? (
                        "SOLD"
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          BUY NOW
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredNfts.length === 0 && nfts.length > 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-300 brutalist-border brutalist-shadow-xl mx-auto mb-6 flex items-center justify-center">
                <Search className="h-12 w-12 text-black" />
              </div>
              <h3 className="brutalist-title text-black mb-4">NO NFTS FOUND</h3>
              <p className="brutalist-text text-gray-600 mb-6">TRY ADJUSTING YOUR FILTERS OR SEARCH TERMS</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("ALL")
                  setSelectedRarity("ALL")
                  setPriceRange("ALL")
                  setSortBy("NEWEST")
                }}
                className="brutalist-button-electric"
              >
                CLEAR FILTERS
              </Button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default MarketplacePage
