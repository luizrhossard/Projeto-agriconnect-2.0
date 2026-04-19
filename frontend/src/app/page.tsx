'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sidebar,
  DashboardHeader,
  DashboardOverview,
  CropManagement,
  MarketPrices,
  TasksPanel,
  WeatherWidget,
  AnalyticsPanel
} from '@/components/agriculture'
import api, { CulturaResponse, TarefaResponse, PrecoMercadoResponse } from '@/lib/api'

interface CropData {
  id: number
  name: string
  variety: string
  area: string
  status: 'planted' | 'growing' | 'harvest'
  progress: number
  plantedDate: string
  harvestDate: string | null
  health: 'excellent' | 'good' | 'warning' | 'critical'
  irrigation: string
  color: string
  gradient: string
  Icon: null
  icone: string
}

interface TarefaData {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed'
  dueDate: string
  assignedTo: string
  location: string
  type: 'irrigation' | 'fertilizer' | 'monitoring' | 'harvest' | 'maintenance' | 'analysis'
}

interface PrecoData {
  id: number
  produto: string
  preco: number
  variacao: number | null
}

const mapCulturaToCropData = (cultura: CulturaResponse): CropData => {
  const statusMap: Record<string, 'planted' | 'growing' | 'harvest'> = {
    'PLANTED': 'planted',
    'GROWING': 'growing',
    'HARVEST': 'harvest'
  }
  const healthMap: Record<'excellent' | 'good' | 'warning' | 'critical', string> = {
    'excellent': '#22c55e',
    'good': '#22c55e',
    'warning': '#f59e0b',
    'critical': '#ef4444'
  }
  const gradientMap: Record<string, string> = {
    'PLANTED': 'from-sky-400 to-blue-500',
    'GROWING': 'from-green-500 to-emerald-600',
    'HARVEST': 'from-amber-400 to-orange-500'
  }
  
  return {
    id: cultura.id,
    name: cultura.nome,
    variety: cultura.nome,
    area: `${cultura.area} ha`,
    status: statusMap[cultura.status] || 'growing',
    progress: cultura.progress ?? 0,
    plantedDate: cultura.dataPlantio,
    harvestDate: cultura.previsaoColheita ?? null,
    health: 'good',
    irrigation: 'Automática',
    color: healthMap.good,
    gradient: gradientMap[cultura.status] || 'from-green-500 to-emerald-600',
    Icon: null,
    icone: cultura.icone || 'soja'
  }
}

const mapTarefaToTarefaData = (tarefa: TarefaResponse): TarefaData => {
  const priorityMap: Record<string, 'high' | 'medium' | 'low'> = {
    'HIGH': 'high',
    'MEDIUM': 'medium',
    'LOW': 'low',
    'ALTA': 'high',
    'MEDIA': 'medium',
    'BAIXA': 'low',
    'URGENTE': 'high'
  }
  const statusMap: Record<string, 'pending' | 'in_progress' | 'completed'> = {
    'PENDING': 'pending',
    'IN_PROGRESS': 'in_progress',
    'COMPLETED': 'completed'
  }
  
  return {
    id: tarefa.id,
    title: tarefa.titulo,
    description: tarefa.descricao || '',
    priority: priorityMap[tarefa.prioridade] || 'medium',
    status: statusMap[tarefa.status] || 'pending',
    dueDate: tarefa.dataVencimento,
    assignedTo: 'Usuário',
    location: tarefa.culturaNome || 'Geral',
    type: 'monitoring'
  }
}

const mapPrecoToPrecoData = (preco: PrecoMercadoResponse): PrecoData => ({
  id: preco.id,
  produto: preco.produto,
  preco: preco.preco,
  variacao: preco.variacao
})

export default function Home() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [culturas, setCulturas] = useState<CropData[]>([])
  const [tarefas, setTarefas] = useState<TarefaData[]>([])
  const [precos, setPrecos] = useState<PrecoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [culturasData, tarefasData, precosData] = await Promise.all([
        api.culturas.getAll().catch(() => []),
        api.tarefas.getAll().catch(() => []),
        api.precos.getAll().catch(() => [])
      ])

      setCulturas(culturasData.map(mapCulturaToCropData))
      setTarefas(tarefasData.map(mapTarefaToTarefaData))
      setPrecos(precosData.map(mapPrecoToPrecoData))
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados do servidor')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCulturaCreated = useCallback(() => {
    fetchData()
  }, [fetchData])

  const handleTarefaCreated = useCallback(() => {
    fetchData()
  }, [fetchData])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }

    const culturasData = culturas
    const tarefasData = tarefas
    const precosData = precos

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-5">
            <DashboardOverview culturas={culturasData} tarefas={tarefasData} />
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div className="xl:col-span-8">
                <CropManagement compact culturas={culturasData} onCulturaCreated={handleCulturaCreated} />
              </div>
              <div className="xl:col-span-4 space-y-5">
                <WeatherWidget />
                <TasksPanel compact tarefas={tarefasData} onTarefaCreated={handleTarefaCreated} />
              </div>
            </div>
            <AnalyticsPanel />
          </div>
        )
      case 'crops':
        return <CropManagement culturas={culturasData} onCulturaCreated={handleCulturaCreated} />
      case 'insumos':
        router.push('/insumos')
        return null
      case 'market':
        return <MarketPrices />
      case 'tasks':
        return <TasksPanel tarefas={tarefasData} onTarefaCreated={handleTarefaCreated} />
      case 'analytics':
        return <AnalyticsPanel />
      default:
        return (
          <div className="space-y-5">
            <DashboardOverview culturas={culturasData} tarefas={tarefasData} />
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div className="xl:col-span-8">
                <CropManagement compact culturas={culturasData} onCulturaCreated={handleCulturaCreated} />
              </div>
              <div className="xl:col-span-4 space-y-5">
                <WeatherWidget />
                <TasksPanel compact tarefas={tarefasData} onTarefaCreated={handleTarefaCreated} />
              </div>
            </div>
            <AnalyticsPanel />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f6f5]">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        culturas={culturas}
      />
      
      <div className="lg:pl-72 transition-all duration-300">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-4 md:p-6 lg:p-7">
          <div className="mx-auto w-full max-w-[1540px]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
