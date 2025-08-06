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
import { Search, Filter, ShoppingCart, Zap, TrendingUp, Eye, Heart, ChevronDown, Coins, Star, Clock, Users, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import { Navigation } from "./navigation"
import { showToast } from "@/lib/toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Toaster } from "react-hot-toast"
import { useWallet } from "@solana/wallet-adapter-react"
import { trpc } from "../clients/trpc"

interface NFTListing {
  price: bigint
  marketplaceId: number | null
  id: number
  nftId: number
  listingId: number
  sellerId: number
  createdAt: string
  updatedAt: string
  isActive: boolean
  // Extended properties for UI
  name?: string
  description?: string
  image?: string
  creator?: string
  owner?: string
  category?: string
  rarity?: string
  likes?: number
  views?: number
  isLiked?: boolean
  currency?: string
  isAvailable?: boolean
}

function MarketplacePage() {
  const { connected, publicKey } = useWallet()
  const [filteredNfts, setFilteredNfts] = useState<NFTListing[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [selectedRarity, setSelectedRarity] = useState<string>("ALL")
  const [sortBy, setSortBy] = useState<string>("NEWEST")
  const [priceRange, setPriceRange] = useState<string>("ALL")
  const [purchasingNfts, setPurchasingNfts] = useState<Set<number>>(new Set())
  const [likedNfts, setLikedNfts] = useState<Set<number>>(new Set())

  const categories = ["ALL", "ART", "MUSIC", "GAMING", "UTILITY", "COLLECTIBLE"]
  const rarities = ["ALL", "COMMON", "RARE", "EPIC", "LEGENDARY"]
  const sortOptions = ["NEWEST", "OLDEST", "PRICE_LOW", "PRICE_HIGH", "MOST_LIKED"]
  const priceRanges = ["ALL", "UNDER_1", "1_TO_5", "OVER_5"]

  // tRPC Queries
  const {
    data: allListings,
    isLoading: isLoadingListings,
    error: listingsError,
    refetch: refetchListings
  } = trpc.marketplaceRouter.getListings.useQuery(undefined, {
    retry: 3,
    retryDelay: 1000,
  })
  console.log("allListings", allListings)
  useEffect(()=>{
    refetchListings()
  },[])

  const {
    data: myListings,
    isLoading: isLoadingMyListings,
    error: myListingsError,
  } = trpc.marketplaceRouter.getMyListings.useQuery(undefined, {
    enabled: connected,
    retry: 2,
  })
  
  // tRPC Mutations
  // setFilteredNfts(getAllNftListings.data)/
  const buyNftMutation = trpc.marketplaceRouter.buyNft.useMutation({
    onSuccess: (data, variables) => {
      showToast.success("NFT purchased successfully!")
      setPurchasingNfts(prev => {
        const newSet = new Set(prev)
        newSet.delete(variables.listingId)
        return newSet
      })
      // Refetch listings to get updated data
      refetchListings()
    },
    onError: (error, variables) => {
      console.error("Error buying NFT:", error)
      showToast.error(`Failed to purchase NFT: ${error.message}`)
      setPurchasingNfts(prev => {
        const newSet = new Set(prev)
        newSet.delete(variables.listingId)
        return newSet
      })
    },
  })
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

  const handleLike = async (nftId: number) => {
    if (!connected) {
      showToast.error("Connect your wallet to like NFTs!")
      return
    }
    
    try {
      setLikedNfts(prev => {
        const newSet = new Set(prev)
        if (newSet.has(nftId)) {
          newSet.delete(nftId)
        } else {
          newSet.add(nftId)
        }
        return newSet
      })

      // Simulate API call for liking
      await new Promise((resolve) => setTimeout(resolve, 500))
      showToast.success("Preference updated!")
    } catch (error) {
      console.error("Error updating like:", error)
      showToast.error("Failed to update preference")
      // Revert the change
      setLikedNfts(prev => {
        const newSet = new Set(prev)
        if (newSet.has(nftId)) {
          newSet.delete(nftId)
        } else {
          newSet.add(nftId)
        }
        return newSet
      })
    }
  }

  const handleBuy = async (listing: NFTListing) => {
    if (!connected) {
      showToast.error("Connect your wallet to purchase NFTs!")
      return
    }

    if (!listing.isActive) {
      showToast.error("This NFT is no longer available!")
      return
    }
    
    setPurchasingNfts(prev => new Set(prev).add(listing.id))

    try {
      await buyNftMutation.mutateAsync({
        listingId: listing.listingId,
        nftId: listing.nftId,
        price: listing.price,
      })
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Purchase error:", error)
    }
  }

  // const getAllNftListings=trpc.marketplaceRouter.getListings.useQuery()
  // if(!getAllNftListings.data){
  //   return <LoadingSpinner />
  // }
  // // allListings= getAllNftListings.data
  // setFilteredNfts(getAllNftListings.data)
  // Process and filter NFTs
  useEffect(() => {
    if (!allListings) return
    
    let processed = allListings.map((listing): NFTListing => ({
      ...listing,
      // Add mock UI data for demo purposes
      name: `NFT #${listing.nftId}`,
      description: `Unique digital asset from listing ${listing.listingId}`,
      image: `/placeholder.svg?height=300&width=300&text=NFT+${listing.nftId}`,
      creator: `Creator_${listing.sellerId}`,
      owner: `Owner_${listing.sellerId}`,
      category: ["ART", "MUSIC", "GAMING", "UTILITY", "COLLECTIBLE"][listing.nftId % 5],
      rarity: ["COMMON", "RARE", "EPIC", "LEGENDARY"][listing.nftId % 4],
      likes: Math.floor(Math.random() * 500),
      views: Math.floor(Math.random() * 2000),
      isLiked: likedNfts.has(listing.id),
      currency: "SOL",
      isAvailable: listing.isActive,
      
    }))

    // Apply filters
    if (searchQuery) {
      processed = processed.filter(
        (nft) =>
          nft.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.creator?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "ALL") {
      processed = processed.filter((nft) => nft.category === selectedCategory)
    }

    if (selectedRarity !== "ALL") {
      processed = processed.filter((nft) => nft.rarity === selectedRarity)
    }

    if (priceRange !== "ALL") {
      switch (priceRange) {
        case "UNDER_1":
          processed = processed.filter((nft) => Number(nft.price) < 1000000000) // 1 SOL in lamports
          break
        case "1_TO_5":
          processed = processed.filter((nft) => 
            Number(nft.price) >= 1000000000 && Number(nft.price) <= 5000000000
          )
          break
        case "OVER_5":
          processed = processed.filter((nft) => Number(nft.price) > 5000000000)
          break
      }
    }

    // Sort
    switch (sortBy) {
      case "NEWEST":
        processed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "OLDEST":
        processed.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "PRICE_LOW":
        processed.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "PRICE_HIGH":
        processed.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case "MOST_LIKED":
        processed.sort((a, b) => (b.likes || 0) - (a.likes || 0))
        break
    }

    setFilteredNfts(processed)
  }, [allListings, searchQuery, selectedCategory, selectedRarity, sortBy, priceRange, likedNfts])

  // Loading state
  if (isLoadingListings) {
    return (
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        <Navigation />
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" text="LOADING MARKETPLACE..." />
        </div>
      </div>
    )
  }

  // Error state
  if (listingsError) {
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
              <p className="brutalist-text text-white text-sm mb-6">
                {listingsError.message || "Failed to load NFT listings"}
              </p>
              <Button 
                onClick={() => refetchListings()} 
                className="brutalist-button-electric w-full"
                disabled={isLoadingListings}
              >
                {isLoadingListings ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                TRY AGAIN
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const nfts = allListings || []

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
                <p className="text-2xl font-black text-black">
                  {new Set(nfts.map((n) => n.sellerId)).size}
                </p>
                <p className="brutalist-text text-black text-xs">SELLERS</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-400 brutalist-border brutalist-shadow hover:brutalist-shadow-lg transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-black brutalist-border mx-auto mb-2 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-2xl font-black text-black">
                  {(nfts.reduce((sum, nft) => sum + Number(nft.price), 0) / 1000000000).toFixed(1)}
                </p>
                <p className="brutalist-text text-black text-xs">SOL VOLUME</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500 brutalist-border brutalist-shadow hover:brutalist-shadow-lg transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-black brutalist-border mx-auto mb-2 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-2xl font-black text-white">
                  {nfts.filter((n) => n.isActive).length}
                </p>
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
                      <DropdownMenuRadioItem 
                        key={rarity} 
                        value={rarity} 
                        className="hover:bg-lime-400 brutalist-text"
                      >
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
                      <DropdownMenuRadioItem 
                        key={option} 
                        value={option} 
                        className="hover:bg-lime-400 brutalist-text"
                      >
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
            <Button 
              onClick={() => refetchListings()} 
              className="brutalist-button-cyber" 
              disabled={isLoadingListings}
            >
              {isLoadingListings ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
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
                      alt={nft.name || `NFT ${nft.nftId}`}
                      className="w-full h-48 object-cover brutalist-border-thick"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={`${getRarityColor(nft.rarity || 'COMMON')} brutalist-border text-xs font-black`}>
                        {nft.rarity || 'COMMON'}
                      </Badge>
                      <Badge className={`${getCategoryColor(nft.category || 'ART')} brutalist-border text-xs font-black`}>
                        {nft.category || 'ART'}
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
                    {!nft.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-red-500 text-white brutalist-border font-black">
                          SOLD OUT
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="brutalist-text text-black text-sm mb-1">
                      {nft.name || `NFT #${nft.nftId}`}
                    </h3>
                    <p className="text-xs text-gray-600 font-bold line-clamp-2">
                      {nft.description || `Unique digital asset from listing ${nft.listingId}`}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-500">CREATOR</p>
                    <p className="brutalist-text text-black text-xs">
                      {nft.creator || `Creator_${nft.sellerId}`}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span className="text-xs font-bold">{nft.likes || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-gray-500" />
                        <span className="text-xs font-bold">{nft.views || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500">PRICE</p>
                      <p className="brutalist-text text-black">
                        {(Number(nft.price) / 1000000000).toFixed(2)} {nft.currency || 'SOL'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleBuy(nft)}
                      className="brutalist-button-electric px-4 py-2 text-xs"
                      disabled={!connected || !nft.isActive || purchasingNfts.has(nft.id)}
                    >
                      {purchasingNfts.has(nft.id) ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : !nft.isActive ? (
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
              <p className="brutalist-text text-gray-600 mb-6">
                TRY ADJUSTING YOUR FILTERS OR SEARCH TERMS
              </p>
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

          {/* No data state */}
          {nfts.length === 0 && !isLoadingListings && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-300 brutalist-border brutalist-shadow-xl mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-black" />
              </div>
              <h3 className="brutalist-title text-black mb-4">NO LISTINGS AVAILABLE</h3>
              <p className="brutalist-text text-gray-600 mb-6">
                THERE ARE NO NFT LISTINGS IN THE MARKETPLACE YET
              </p>
              <Button
                onClick={() => refetchListings()}
                className="brutalist-button-electric"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                REFRESH
              </Button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default MarketplacePage
