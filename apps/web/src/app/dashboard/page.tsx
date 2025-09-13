'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data - replace with real API calls
const metrics = {
  totalLeads: 1542,
  activeConversations: 47,
  scheduledVisits: 23,
  conversionRate: 24.5,
  avgResponseTime: 1.8,
  leadsToday: 42,
  visitedToday: 6,
  escalated: 3
}

const chartData = [
  { name: 'Lun', leads: 35, conversions: 8 },
  { name: 'Mar', leads: 42, conversions: 10 },
  { name: 'Mie', leads: 38, conversions: 9 },
  { name: 'Jue', leads: 45, conversions: 12 },
  { name: 'Vie', leads: 52, conversions: 15 },
  { name: 'Sáb', leads: 28, conversions: 6 },
  { name: 'Dom', leads: 15, conversions: 3 },
]

const projectData = [
  { project: 'Surubí', leads: 450, conversions: 112 },
  { project: 'Alzara', leads: 380, conversions: 85 },
  { project: 'Altavida Norte', leads: 290, conversions: 68 },
  { project: 'Altavida Luque', leads: 220, conversions: 52 },
  { project: 'Alcántara', leads: 142, conversions: 31 },
  { project: 'Veralta', leads: 60, conversions: 12 },
]

const recentLeads = [
  { id: 1, name: 'María González', project: 'Surubí', status: 'contacted', time: '5 min' },
  { id: 2, name: 'Carlos Rodríguez', project: 'Alzara', status: 'scheduled', time: '12 min' },
  { id: 3, name: 'Ana López', project: 'Altavida', status: 'new', time: '18 min' },
  { id: 4, name: 'Juan Martínez', project: 'Surubí', status: 'visited', time: '25 min' },
  { id: 5, name: 'Laura Silva', project: 'Alcántara', status: 'contacted', time: '32 min' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitoreo en tiempo real del sistema Almira
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalLeads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{metrics.leadsToday} hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversaciones Activas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeConversations}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.escalated} escaladas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.scheduledVisits}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.visitedToday} completadas hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Lead a visita
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Leads por Día</CardTitle>
              <CardDescription>Última semana</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Leads"
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Conversiones"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leads por Proyecto</CardTitle>
              <CardDescription>Total acumulado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="project" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                  <Bar dataKey="conversions" fill="#10b981" name="Conversiones" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Respuesta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgResponseTime}s</div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: '90%' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Objetivo: &lt;2 segundos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precisión IA</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96.2%</div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: '96.2%' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Respuestas correctas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Escalación</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.4%</div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all"
                  style={{ width: '6.4%' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Objetivo: &lt;10%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Leads Recientes</CardTitle>
                <CardDescription>Últimos leads ingresados al sistema</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-600' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-600' :
                      lead.status === 'scheduled' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {lead.status === 'new' ? 'Nuevo' :
                       lead.status === 'contacted' ? 'Contactado' :
                       lead.status === 'scheduled' ? 'Agendado' :
                       'Visitado'}
                    </span>
                    <span className="text-sm text-gray-500">hace {lead.time}</span>
                    <Link href={`/chat/${lead.id}`}>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}