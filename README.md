# 🚀 Almira Custom - Sistema de Gestión de Leads con IA

Sistema personalizado de gestión de leads con inteligencia artificial para Altamira Group, optimizado para el mercado inmobiliario paraguayo.

## 🎯 Características Principales

- **IA Conversacional**: Almira responde automáticamente a leads usando GPT-4 con RAG
- **Knowledge Base**: Sistema de conocimiento sobre proyectos Altamira (Surubí, Altavilla, Alzara)
- **Integración Total**: Conecta HubSpot, Calendly, WhatsApp y SAP
- **Dashboard en Tiempo Real**: Métricas y analytics de conversiones
- **Automatización**: Follow-ups automáticos y agendamiento inteligente

## 🏗️ Arquitectura

```
Meta/Facebook → HubSpot → n8n/Almira IA → WhatsApp
                              ↓
                        Web App Dashboard
                              ↓
                    Supabase (DB + Vector Store)
```

## 💻 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + pgvector)
- **AI/Workflows**: n8n self-hosted
- **Integraciones**: WhatsApp Business API, HubSpot, Calendly, OpenAI

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+
- pnpm
- Supabase CLI
- Docker (para desarrollo local)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/clickmediapropy/almira-custom.git
cd almira-custom

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar Supabase local
supabase start

# Ejecutar migraciones
supabase db push

# Iniciar desarrollo
pnpm dev
```

### Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# WhatsApp Business
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# HubSpot
HUBSPOT_API_KEY=

# Calendly
CALENDLY_API_KEY=

# n8n
N8N_WEBHOOK_URL=
```

## 📁 Estructura del Proyecto

```
almira-custom/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── workflows/           # n8n workflow exports
├── packages/
│   ├── database/           # Supabase schemas y migrations
│   ├── shared/             # Tipos y utilidades compartidas
│   └── ui/                 # Componentes UI reutilizables
├── supabase/
│   ├── functions/          # Edge Functions
│   └── migrations/         # Database migrations
└── docs/                   # Documentación del proyecto
```

## 🔧 Desarrollo

### Comandos Principales

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Build de producción
pnpm lint             # Ejecutar linter
pnpm test             # Ejecutar tests

# Base de datos
pnpm db:push          # Push migrations a Supabase
pnpm db:pull          # Pull schema desde Supabase
pnpm db:generate      # Generar tipos TypeScript

# Deployment
pnpm deploy:web       # Deploy frontend a Vercel
pnpm deploy:functions # Deploy Edge Functions
```

### Workflow Development

Los workflows de n8n se desarrollan en el servidor:
- Server: `194.163.151.246`
- Acceso: SSH con credenciales provistas

## 📊 Métricas y Monitoreo

El sistema trackea automáticamente:
- Response time (<2 segundos objetivo)
- Conversion rate (>25% lead to visit)
- Escalation rate (<10% a humanos)
- Cost per lead (<$2.50)

## 🔐 Seguridad

- Row Level Security (RLS) en Supabase
- API Keys en variables de entorno
- Rate limiting en Edge Functions
- Validación de datos con Zod

## 📚 Documentación

- [Arquitectura Detallada](docs/architecture.md)
- [Setup Guide](docs/setup.md)
- [API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Proyecto privado para Altamira Group. Todos los derechos reservados.

## 👥 Equipo

- **Cliente**: Altamira Group
- **Desarrollo**: ClickMedia Pro
- **Contacto**: admin@clickmediapro.com.py

---

*Desarrollado con ❤️ para Altamira Group por ClickMedia Pro*