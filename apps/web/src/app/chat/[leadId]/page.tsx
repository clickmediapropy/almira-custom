'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Message {
  id: string
  sender: 'lead' | 'almira' | 'agent'
  content: string
  timestamp: Date
  status?: 'sent' | 'delivered' | 'read'
}

export default function ChatPage() {
  const params = useParams()
  const leadId = params.leadId as string
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data - replace with real API calls
  useEffect(() => {
    // Load initial messages
    setMessages([
      {
        id: '1',
        sender: 'almira',
        content: '¡Hola! Soy Almira, tu asistente virtual de Altamira Group. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read'
      },
      {
        id: '2',
        sender: 'lead',
        content: 'Hola, quiero información sobre Altamira Surubí',
        timestamp: new Date(Date.now() - 3300000),
        status: 'read'
      },
      {
        id: '3',
        sender: 'almira',
        content: 'Excelente elección! Altamira Surubí es un complejo residencial premium en el corazón de Surubí. Ofrecemos departamentos de 1, 2 y 3 dormitorios con amenities de primer nivel. ¿Te gustaría agendar una visita al showroom?',
        timestamp: new Date(Date.now() - 3000000),
        status: 'delivered'
      }
    ])
  }, [leadId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response - replace with real API call
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'almira',
        content: 'Gracias por tu mensaje. Estoy procesando tu consulta...',
        timestamp: new Date(),
        status: 'delivered'
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with lead info */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Información del Lead</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-medium">Juan Pérez</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">+595 981 123456</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">juan.perez@example.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Proyecto de Interés</p>
            <p className="font-medium">Altamira Surubí</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <p className="font-medium text-green-600">Contactado</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-semibold mb-3">Acciones Rápidas</h3>
          <div className="space-y-2">
            <Button className="w-full" variant="outline" size="sm">
              Agendar Visita
            </Button>
            <Button className="w-full" variant="outline" size="sm">
              Enviar Información
            </Button>
            <Button className="w-full" variant="outline" size="sm">
              Transferir a Humano
            </Button>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">Juan Pérez</h1>
                <p className="text-sm text-gray-500">WhatsApp Chat</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Almira IA Activa</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'lead' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-md ${
                  message.sender === 'lead'
                    ? 'order-2'
                    : 'order-1'
                }`}
              >
                <div className="flex items-end space-x-2">
                  {message.sender === 'lead' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === 'lead'
                        ? 'bg-gray-100 text-gray-900'
                        : message.sender === 'almira'
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'lead'
                          ? 'text-gray-500'
                          : 'text-white/70'
                      }`}
                    >
                      {format(message.timestamp, 'HH:mm', { locale: es })}
                    </p>
                  </div>
                  {message.sender === 'almira' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}