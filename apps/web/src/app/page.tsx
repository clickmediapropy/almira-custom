import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Bot, Calendar, MessageSquare, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Almira - Sistema Inteligente de Gestión de Leads
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Potenciado por IA para Altamira Group. Automatiza la atención de leads,
            agenda visitas y maximiza conversiones.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Bot className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>IA Conversacional</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Almira responde automáticamente usando GPT-4 con conocimiento
                específico de los proyectos
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>WhatsApp Business</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Integración directa con WhatsApp para comunicación instantánea
                con los leads
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Agendamiento Smart</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sincronización con Calendly para agendar visitas a showrooms
                automáticamente
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Analytics en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dashboard con métricas clave: conversión, tiempo de respuesta,
                leads atendidos
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Proyectos Activos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Altamira Surubí',
              'Alzara Plaza',
              'Altavida Norte',
              'Altavida Luque',
              'Parque Alcántara',
              'Veralta Los Laureles',
            ].map((project) => (
              <div
                key={project}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg">{project}</h3>
                <p className="text-sm text-gray-600">
                  Información completa disponible en el sistema
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Acceder al Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}