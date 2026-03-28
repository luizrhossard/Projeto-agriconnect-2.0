'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Sprout,
  Droplets,
  FlaskConical,
  Bug,
  Wrench,
  Wheat,
  Package,
  CheckCircle2,
  CircleDot,
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  Wind,
  AlertTriangle,
  Info
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import api, { AtividadeRecenteResponse } from '@/lib/api'
import { useAgriculturalWeather } from '@/hooks/useAgriculturalWeather'

const productionData = [
  { month: 'Ago', soja: 180, milho: 120, cafe: 85 },
  { month: 'Set', soja: 220, milho: 140, cafe: 90 },
  { month: 'Out', soja: 280, milho: 160, cafe: 95 },
  { month: 'Nov', soja: 320, milho: 180, cafe: 100 },
  { month: 'Dez', soja: 350, milho: 200, cafe: 110 },
  { month: 'Jan', soja: 380, milho: 220, cafe: 120 },
]

const performanceMetrics = [
  { 
    label: 'Produtividade Média', 
    value: '3.2 ton/ha', 
    change: '+8.5%', 
    trend: 'up',
    description: 'vs. safra anterior'
  },
  { 
    label: 'Eficiência Hídrica', 
    value: '92%', 
    change: '+3.2%', 
    trend: 'up',
    description: 'uso de água'
  },
  { 
    label: 'Custo por Hectare', 
    value: 'R$ 2.450', 
    change: '-5.8%', 
    trend: 'up',
    description: 'redução de custos'
  },
  { 
    label: 'Área Colhida', 
    value: '380 ha', 
    change: '+12%', 
    trend: 'up',
    description: 'este mês'
  },
]

const recentActivities = [
  { date: '12 Jan', activity: 'Colheita iniciada', crop: 'Café', area: '50 ha', icon: '☕' },
  { date: '11 Jan', activity: 'Irrigação aplicada', crop: 'Soja', area: '120 ha', icon: '💧' },
  { date: '10 Jan', activity: 'Fertilizante NPK', crop: 'Milho', area: '80 ha', icon: '🧪' },
  { date: '09 Jan', activity: 'Controle de pragas', crop: 'Soja', area: '100 ha', icon: '🐛' },
  { date: '08 Jan', activity: 'Plantio concluído', crop: 'Feijão', area: '50 ha', icon: '🌱' },
]

export function AnalyticsPanel() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)
  const [atividades, setAtividades] = useState<AtividadeRecenteResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [metricas, setMetricas] = useState({
    produtividadeMedia: 3.2,
    variacaoProdutividade: 8.5,
    eficienciaHidrica: 92,
    variacaoUsoAgua: 3.2,
    custoPorHectare: 2450,
    variacaoCusto: -5.8,
    areaColhida: 380,
    variacaoAreaColhida: 12
  })
  const maxValue = Math.max(...productionData.flatMap(d => [d.soja, d.milho, d.cafe]))
  
  // Hook para buscar dados climáticos reais (São Paulo como default)
  const { weather, insights, isLoading: weatherLoading } = useAgriculturalWeather(-23.5505, -46.6333)

  useEffect(() => {
    carregarDadosDashboard()
  }, [])

  const carregarDadosDashboard = async () => {
    try {
      setIsLoading(true)
      const dashboard = await api.dashboard.getResumo()
      
      setAtividades(dashboard.atividadesRecentes || [])
      
      // Atualizar métricas com dados reais
      if (dashboard.produtividadeMedia) {
        setMetricas({
          produtividadeMedia: dashboard.produtividadeMedia.doubleValue(),
          variacaoProdutividade: dashboard.variacaoProdutividade?.doubleValue() || 0,
          eficienciaHidrica: dashboard.eficienciaHidrica?.doubleValue() || 0,
          variacaoUsoAgua: dashboard.variacaoUsoAgua?.doubleValue() || 0,
          custoPorHectare: dashboard.custoPorHectare?.doubleValue() || 0,
          variacaoCusto: dashboard.variacaoCusto?.doubleValue() || 0,
          areaColhida: dashboard.areaColhida?.doubleValue() || 0,
          variacaoAreaColhida: dashboard.variacaoAreaColhida?.doubleValue() || 0
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderInsightIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <Sun className="w-5 h-5" />
      case 'droplet': return <Droplets className="w-5 h-5" />
      case 'cloud': return <Cloud className="w-5 h-5" />
      case 'cloud-rain': return <CloudRain className="w-5 h-5" />
      case 'thermometer': return <Thermometer className="w-5 h-5" />
      case 'wind': return <Wind className="w-5 h-5" />
      case 'check': return <CheckCircle2 className="w-5 h-5" />
      default: return <Info className="w-5 h-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-500/20 text-amber-100 border-amber-500/30'
      case 'alert': return 'bg-red-500/20 text-red-100 border-red-500/30'
      case 'success': return 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30'
      default: return 'bg-blue-500/20 text-blue-100 border-blue-500/30'
    }
  }

  const getMainInsight = () => {
    if (insights.length === 0) return null
    // Prioriza alertas e warnings
    const alert = insights.find(i => i.type === 'alert')
    const warning = insights.find(i => i.type === 'warning')
    const success = insights.find(i => i.type === 'success')
    return alert || warning || success || insights[0]
  }

  // Mapeia atividades da API para o formato de exibição
  const getAtividadesExibicao = () => {
    if (atividades.length === 0) return []
    return atividades.slice(0, 5).map(atividade => ({
      date: atividade.data,
      activity: atividade.titulo,
      crop: atividade.culturaNome || atividade.descricao,
      area: atividade.area,
      icon: atividade.icone || 'seedling',
      corFundo: atividade.corFundo || 'bg-gray-100 text-gray-600'
    }))
  }

  // Renderiza o ícone baseado no tipo
  const renderIcone = (iconeTipo: string, className: string = "w-5 h-5") => {
    switch (iconeTipo) {
      case 'seedling':
        return <Sprout className={className} />
      case 'droplet':
        return <Droplets className={className} />
      case 'flask-conical':
        return <FlaskConical className={className} />
      case 'flask':
        return <FlaskConical className={className} />
      case 'bug':
        return <Bug className={className} />
      case 'wrench':
        return <Wrench className={className} />
      case 'wheat':
        return <Wheat className={className} />
      case 'package':
        return <Package className={className} />
      case 'check-circle':
        return <CheckCircle2 className={className} />
      default:
        return <CircleDot className={className} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Produtividade Média */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-gray-500">Produtividade Média</p>
            <div className="flex items-end justify-between mt-2">
              <div>
                <p className="text-2xl font-bold text-gray-800">{metricas.produtividadeMedia.toFixed(1)} ton/ha</p>
                <div className="flex items-center gap-1 mt-1">
                  {metricas.variacaoProdutividade >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metricas.variacaoProdutividade >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {metricas.variacaoProdutividade >= 0 ? '+' : ''}{metricas.variacaoProdutividade.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-400">vs. safra anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eficiência Hídrica */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-gray-500">Eficiência Hídrica</p>
            <div className="flex items-end justify-between mt-2">
              <div>
                <p className="text-2xl font-bold text-gray-800">{metricas.eficienciaHidrica.toFixed(0)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {metricas.variacaoUsoAgua >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metricas.variacaoUsoAgua >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {metricas.variacaoUsoAgua >= 0 ? '+' : ''}{metricas.variacaoUsoAgua.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-400">uso de água</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custo por Hectare */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-gray-500">Custo por Hectare</p>
            <div className="flex items-end justify-between mt-2">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  R$ {metricas.custoPorHectare.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {metricas.variacaoCusto >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metricas.variacaoCusto >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {metricas.variacaoCusto >= 0 ? '+' : ''}{metricas.variacaoCusto.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-400">redução de custos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Área Colhida */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-gray-500">Área Colhida</p>
            <div className="flex items-end justify-between mt-2">
              <div>
                <p className="text-2xl font-bold text-gray-800">{metricas.areaColhida.toFixed(0)} ha</p>
                <div className="flex items-center gap-1 mt-1">
                  {metricas.variacaoAreaColhida >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metricas.variacaoAreaColhida >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {metricas.variacaoAreaColhida >= 0 ? '+' : ''}{metricas.variacaoAreaColhida.toFixed(0)}%
                  </span>
                  <span className="text-xs text-gray-400">este mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Chart */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Produção por Cultura
            </CardTitle>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="6months">
                <TabsList className="h-8">
                  <TabsTrigger value="6months" className="text-xs">6 meses</TabsTrigger>
                  <TabsTrigger value="year" className="text-xs">Ano</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {/* Legend */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-600">Soja</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-gray-600">Milho</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-600">Café</span>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-4">
              {productionData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 w-12">{data.month}</span>
                    <div className="flex-1 flex gap-2 mx-4">
                      {/* Soja Bar */}
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${(data.soja / maxValue) * 100}%` }}
                        />
                      </div>
                      {/* Milho Bar */}
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${(data.milho / maxValue) * 100}%` }}
                        />
                      </div>
                      {/* Café Bar */}
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${(data.cafe / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Export */}
            <div className="flex justify-end mt-6">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : (
                getAtividadesExibicao().map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${activity.corFundo} shrink-0`}>
                      {renderIcone(activity.icon, "w-4 h-4")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{activity.activity}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{activity.crop}</span>
                        {activity.area && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{activity.area}</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.date}</p>
                    </div>
                  </div>
                ))
              )}
              {atividades.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma atividade recente</p>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              onClick={() => setIsDialogOpen(true)}
            >
              Ver Todas as Atividades
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* All Activities Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="w-6 h-6 text-emerald-600" />
              Todas as Atividades
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : atividades.length > 0 ? (
              atividades.map((atividade, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${atividade.corFundo || 'bg-gray-100 text-gray-600'} shrink-0`}>
                    {renderIcone(atividade.iconeTipo || atividade.icone || 'seedling', "w-5 h-5")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{atividade.titulo}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{atividade.descricao}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {atividade.culturaNome && (
                        <span className="text-xs text-gray-500">{atividade.culturaNome}</span>
                      )}
                      {atividade.area && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{atividade.area}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{atividade.data}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma atividade registrada</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dynamic Insights Banner */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-teal-500 to-emerald-600">
        <CardContent className="p-6">
          {weatherLoading ? (
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-white">Carregando dados climáticos...</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-4 flex-1">
                <div className="p-3 bg-white/20 rounded-xl shrink-0">
                  {getMainInsight() ? renderInsightIcon(getMainInsight()!.icon) : <TrendingUp className="w-8 h-8 text-white" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">
                    {getMainInsight()?.title || 'Insights da Safra'}
                  </h3>
                  <p className="text-emerald-100 text-sm mt-1">
                    {getMainInsight()?.description || 'Carregando informações climáticas...'}
                  </p>
                  {weather && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-white/90 text-xs">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>{weather.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 text-xs">
                        <Droplets className="w-3.5 h-3.5" />
                        <span>{weather.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 text-xs">
                        <CloudRain className="w-3.5 h-3.5" />
                        <span>{weather.precipitation}mm</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 text-xs">
                        <Wind className="w-3.5 h-3.5" />
                        <span>{weather.windSpeed} km/h</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Button
                className="bg-white text-emerald-700 hover:bg-emerald-50 shrink-0"
                onClick={() => setIsAnalysisOpen(true)}
              >
                Ver Análise Completa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Análise Completa Dialog */}
      <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Análise Climática e Insights
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {weatherLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
              </div>
            ) : weather ? (
              <>
                {/* Condições Atuais */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-emerald-600" />
                    Condições Atuais
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Thermometer className="w-4 h-4" />
                        Temperatura
                      </div>
                      <p className="text-lg font-bold text-gray-800">{weather.temperature}°C</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Droplets className="w-4 h-4" />
                        Umidade
                      </div>
                      <p className="text-lg font-bold text-gray-800">{weather.humidity}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <CloudRain className="w-4 h-4" />
                        Precipitação
                      </div>
                      <p className="text-lg font-bold text-gray-800">{weather.precipitation}mm</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Wind className="w-4 h-4" />
                        Vento
                      </div>
                      <p className="text-lg font-bold text-gray-800">{weather.windSpeed} km/h</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Sun className="w-4 h-4" />
                        UV Index
                      </div>
                      <p className="text-lg font-bold text-gray-800">{weather.uvIndex}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Cloud className="w-4 h-4" />
                        Condição
                      </div>
                      <p className="text-sm font-bold text-gray-800">{weather.condition}</p>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Insights e Recomendações
                  </h4>
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white/20 rounded-lg shrink-0">
                            {renderInsightIcon(insight.icon)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{insight.title}</p>
                            <p className="text-sm mt-1 opacity-90">{insight.description}</p>
                            <p className="text-xs mt-2 font-medium bg-white/20 inline-block px-2 py-1 rounded">
                              💡 {insight.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dados da API */}
                <div className="text-xs text-gray-400 text-center">
                  Dados fornecidos por Open-Meteo API • Atualizado em tempo real
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Cloud className="w-16 h-16 mx-auto mb-3 opacity-20" />
                <p>Erro ao carregar dados climáticos</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
