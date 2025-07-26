"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Bot, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
}

function ChatPart() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
    const [position,setPosition]=useState()
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message on component mount
    const welcomeMessage: Message = {
      id: "welcome",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages([welcomeMessage])
  }, [])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(async () => {
      setIsLoading(true)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${userMessage.content}". This is a simulated response. In a real implementation, this would connect to your AI model.`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      setIsLoading(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#948979] border-black border-8">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded mx-auto mb-4 flex items-center justify-center">
                <Bot className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Start a Conversation</h3>
              <p className="text-gray-500">Send a message to begin chatting with your AI assistant</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <Card
                className={`max-w-[70%] border-2 border-black ${
                  message.sender === "user" ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.sender === "user" ? "text-gray-300" : "text-gray-500"}`}>
                    {message.timestamp}
                  </p>
                </CardContent>
              </Card>

              {message.sender === "user" && (
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <Card className="border-2 border-black bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-6 border-t-2 border-black border-8 mx-auto bg-[#948979] w-5xl">
        <div className="flex gap-3">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 border-gray-300 focus:border-black"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-black hover:bg-gray-800 text-white px-6"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
          
             <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="noShadow">Select Model</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel inset>Panel Position</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">Model-1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Model-2</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right" disabled>
              Model-3
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift + Enter for new line</p>
      </div>
    </div>
  )
}

export default ChatPart
