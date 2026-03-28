'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Sprout,
  Droplets,
  Sun,
  Wheat,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  CircleDot
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Card3D } from './animations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import api, { TarefaResponse, CulturaResponse } from '@/lib/api'

interface CropData {
  id: number
  name: string
  area: string
}

interface TarefaData {
  id: number
  status: string
}

interface DashboardOverviewProps {
  culturas?: CropData[]
  tarefas?: TarefaData[]
}

interface AgendaItem {
  id: number
  titulo: string
  data: string
  tipo: 'tarefa' | 'cultura'
  status?: string
  prioridade?: string
  icone: string
  corFundo: string
  descricao?: string
}

export function DashboardOverview({ culturas = [], tarefas = [] }: DashboardOverviewProps) {
  const [isAgendaOpen, setIsAgendaOpen] = useState(false)
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const culturasAtivas = culturas.length || 12
  const totalArea = culturas.reduce((acc, c) => acc + parseFloat(c.area.replace(' ha', '')), 0) || 450
  const tarefasPendentes = tarefas.filter(t => t.status === 'pending').length || 5
  const tarefasConcluidas = tarefas.filter(t => t.status === 'completed').length || 7

  useEffect(() => {
    if (isAgendaOpen) {
      carregarAgenda()
    }
  }, [isAgendaOpen])

  const carregarAgenda = async () => {
    try {
      setIsLoading(true)
      const [tarefasData, culturasData] = await Promise.all([
        api.tarefas.getAll(),
        api.culturas.getAll()
      ])

      const items: AgendaItem[] = []

      // Adicionar tarefas
      tarefasData.forEach(tarefa => {
        items.push({
          id: tarefa.id,
          titulo: tarefa.titulo,
          data: tarefa.dataVencimento,
          tipo: 'tarefa',
          status: tarefa.status,
          prioridade: tarefa.prioridade,
          icone: getIconeTarefa(tarefa.titulo),
          corFundo: getCorFundoTarefa(tarefa.status),
          descricao: tarefa.descricao || ''
        })
      })

      // Adicionar culturas
      culturasData.forEach(cultura => {
        items.push({
          id: cultura.id,
          titulo: `${cultura.nome} - ${cultura.status}`,
          data: cultura.dataPlantio,
          tipo: 'cultura',
          status: cultura.status,
          icone: getIconeCultura(cultura.status),
          corFundo: getCorFundoCultura(cultura.status),
          descricao: `${cultura.area} ha`
        })
      })

      // Ordenar por data
      items.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      setAgendaItems(items)
    } catch (error) {
      console.error('Erro ao carregar agenda:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIconeTarefa = (titulo: string): string => {
    const t = titulo.toLowerCase()
    if (t.includes('irrig')) return 'droplet'
    if (t.includes('fertil')) return 'flask'
    if (t.includes('praga')) return 'bug'
    if (t.includes('colheita')) return 'wheat'
    if (t.includes('plantio')) return 'sprout'
    if (t.includes('manuten')) return 'wrench'
    return 'circle'
  }

  const getIconeCultura = (status: string): string => {
    const s = status?.toLowerCase() || ''
    if (s.includes('plantio') || s.includes('crescendo')) return 'sprout'
    if (s.includes('colheita')) return 'wheat'
    if (s.includes('tratos')) return 'flask'
    if (s.includes('finalizada')) return 'check'
    return 'sprout'
  }

  const getCorFundoTarefa = (status: string): string => {
    const s = status?.toLowerCase() || ''
    if (s.includes('pending') || s.includes('pendente')) return 'bg-amber-100 text-amber-600'
    if (s.includes('progress') || s.includes('andamento')) return 'bg-blue-100 text-blue-600'
    if (s.includes('completed') || s.includes('concluida')) return 'bg-emerald-100 text-emerald-600'
    return 'bg-gray-100 text-gray-600'
  }

  const getCorFundoCultura = (status: string): string => {
    const s = status?.toLowerCase() || ''
    if (s.includes('plantio') || s.includes('crescendo')) return 'bg-emerald-100 text-emerald-600'
    if (s.includes('colheita')) return 'bg-amber-100 text-amber-600'
    if (s.includes('tratos')) return 'bg-violet-100 text-violet-600'
    if (s.includes('finalizada')) return 'bg-emerald-100 text-emerald-600'
    return 'bg-gray-100 text-gray-600'
  }

  const renderIcone = (icone: string, className: string = "w-5 h-5") => {
    switch (icone) {
      case 'sprout': return <Sprout className={className} />
      case 'droplet': return <Droplets className={className} />
      case 'flask': return <Sun className={className} />
      case 'bug': return <AlertCircle className={className} />
      case 'wheat': return <Wheat className={className} />
      case 'wrench': return <MapPin className={className} />
      case 'check': return <CheckCircle2 className={className} />
      default: return <CircleDot className={className} />
    }
  }

  const formatarData = (data: string) => {
    const date = new Date(data + 'T00:00:00')
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const diffTime = date.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Amanhã'
    if (diffDays === -1) return 'Ontem'
    if (diffDays > 1 && diffDays <= 7) return date.toLocaleDateString('pt-BR', { weekday: 'long' })
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const stats = [
    {
      title: 'Culturas Ativas',
      value: culturasAtivas.toString(),
      change: '+2',
      trend: 'up' as const,
      icon: Sprout,
      color: 'emerald',
      gradient: 'from-emerald-400 to-green-600',
      description: 'últimos 30 dias'
    },
    {
      title: 'Área Cultivada',
      value: `${totalArea} ha`,
      change: '+50 ha',
      trend: 'up' as const,
      icon: MapPin,
      color: 'amber',
      gradient: 'from-amber-400 to-orange-500',
      description: 'total da fazenda'
    },
    {
      title: 'Tarefas Pendentes',
      value: tarefasPendentes.toString(),
      change: '-2',
      trend: 'up' as const,
      icon: Wheat,
      color: 'yellow',
      gradient: 'from-yellow-400 to-amber-500',
      description: 'esta semana'
    },
    {
      title: 'Tarefas Concluídas',
      value: tarefasConcluidas.toString(),
      change: '+3',
      trend: 'up' as const,
      icon: Droplets,
      color: 'sky',
      gradient: 'from-sky-400 to-blue-500',
      description: 'esta semana'
    },
  ]
  return (
    <div className="space-y-6">
      {/* Hero Banner with Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700">
            {/* Animated pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:30px_30px]"
                animate={{ backgroundPosition: ['0px 0px', '30px 30px'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            
            {/* Floating orbs */}
            <motion.div 
              className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"
              animate={{ 
                x: [0, 20, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl"
              animate={{ 
                x: [0, -20, 0],
                y: [0, 20, 0],
                scale: [1.2, 1, 1.2]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Logo and Welcome */}
                <div className="flex items-center gap-6">
                  <motion.div
                    className="relative w-64 h-auto"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img
                      src="/logomarca.png"
                      alt="AgriConnect"
                      className="w-full h-auto drop-shadow-xl"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </motion.div>

                  <div className="hidden lg:block w-px h-16 bg-white/20" />
                  
                  <div className="hidden lg:block">
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Sistema de Agricultura Inteligente
                    </motion.h2>
                    <motion.p 
                      className="text-emerald-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Gerencie sua fazenda com tecnologia de ponta
                    </motion.p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    className="px-5 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sprout className="w-4 h-4" />
                    Nova Cultura
                  </motion.button>
                  <motion.button
                    className="px-5 py-2.5 bg-emerald-500/80 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 shadow-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAgendaOpen(true)}
                  >
                    <Sun className="w-4 h-4" />
                    Ver Agenda
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100
              }}
            >
              <Card3D intensity={5}>
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow duration-500 overflow-hidden group">
                  <CardContent className="p-0">
                    {/* Gradient top bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${stat.gradient}`} />
                    
                    <div className="p-5 relative overflow-hidden">
                      {/* Animated background glow */}
                      <motion.div 
                        className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.15, 0.1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: 'easeInOut',
                          delay: index * 0.5
                        }}
                      />
                      
                      <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                          <motion.p 
                            className="text-3xl font-bold text-gray-800"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                          >
                            {stat.value}
                          </motion.p>
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={stat.trend === 'up' ? { 
                                y: [0, -3, 0],
                              } : { 
                                y: [0, 3, 0],
                              }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                            >
                              {stat.trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                            </motion.div>
                            <motion.span 
                              className={`text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              {stat.change}
                            </motion.span>
                            <span className="text-xs text-gray-400">{stat.description}</span>
                          </div>
                        </div>
                        
                        {/* Animated icon container */}
                        <motion.div 
                          className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                          animate={{ 
                            rotateZ: [0, 5, -5, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: 'easeInOut',
                            delay: index * 0.3
                          }}
                          whileHover={{ scale: 1.15, rotateZ: 0 }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </motion.div>
          )
        })}
      </div>

      {/* Agenda Dialog */}
      <Dialog open={isAgendaOpen} onOpenChange={setIsAgendaOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-2xl">
                <Calendar className="w-6 h-6 text-emerald-600" />
                Agenda de Atividades
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAgendaOpen(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
              </div>
            ) : agendaItems.length > 0 ? (
              <div className="space-y-3">
                {agendaItems.map((item, index) => (
                  <motion.div
                    key={`${item.tipo}-${item.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2.5 rounded-lg ${item.corFundo} shrink-0`}>
                      {renderIcone(item.icone, "w-5 h-5")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-800">{item.titulo}</p>
                          {item.descricao && (
                            <p className="text-sm text-gray-600 mt-0.5">{item.descricao}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.tipo}
                          </Badge>
                          {item.prioridade && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {item.prioridade.toLowerCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatarData(item.data)}</span>
                        </div>
                        {item.status && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="capitalize">{item.status.replace('_', ' ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-3 opacity-20" />
                <p className="text-lg font-medium">Nenhuma atividade na agenda</p>
                <p className="text-sm mt-1">Adicione tarefas ou culturas para ver sua agenda</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
