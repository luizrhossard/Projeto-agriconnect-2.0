'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Droplets, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  SojaIcon,
  MilhoIcon,
  CafeIcon,
  FeijaoIcon,
  AlgodaoIcon,
  CanaIcon,
  ArrozIcon,
  TrigoIcon,
  AbacaxiIcon,
  BananaIcon,
  LaranjaIcon,
  MangaIcon,
  UvaIcon,
  MelanciaIcon,
  TomateIcon,
  BatataIcon,
  GenericCropIcon
} from './crop-icons'
import { Card3D, Progress3D } from './animations'
import api, { CulturaRequest } from '@/lib/api'
import { formatDate } from '@/lib/utils'

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
  Icon: React.ComponentType<{ className?: string }> | null
  icone?: string
}

interface CropManagementProps {
  compact?: boolean
  culturas?: CropData[]
  onCulturaCreated?: () => void
}

const getIconForCrop = (name: string): React.ComponentType<{ className?: string }> => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'Soja': SojaIcon,
    'Milho': MilhoIcon,
    'Cafe': CafeIcon,
    'Feijao': FeijaoIcon,
    'Algodao': AlgodaoIcon,
    'Cana-de-Acucar': CanaIcon,
  }
  return iconMap[name] || GenericCropIcon
}

const defaultCrops: CropData[] = [
  {
    id: 1,
    name: 'Soja',
    variety: 'BRS 284',
    area: '120 ha',
    status: 'growing',
    progress: 65,
    plantedDate: '2024-09-15',
    harvestDate: '2025-02-15',
    health: 'good',
    irrigation: 'Automatica',
    color: '#22c55e',
    gradient: 'from-green-500 to-emerald-600',
    Icon: SojaIcon
  },
  {
    id: 2,
    name: 'Milho',
    variety: 'Hibrido 2B587',
    area: '80 ha',
    status: 'growing',
    progress: 45,
    plantedDate: '2024-10-01',
    harvestDate: '2025-03-01',
    health: 'warning',
    irrigation: 'Manual',
    color: '#f59e0b',
    gradient: 'from-amber-400 to-orange-500',
    Icon: MilhoIcon
  },
  {
    id: 3,
    name: 'Cafe',
    variety: 'Arabica',
    area: '150 ha',
    status: 'harvest',
    progress: 90,
    plantedDate: '2024-03-01',
    harvestDate: '2025-01-15',
    health: 'good',
    irrigation: 'Gotejamento',
    color: '#a16207',
    gradient: 'from-amber-600 to-yellow-700',
    Icon: CafeIcon
  },
  {
    id: 4,
    name: 'Feijao',
    variety: 'Carioca',
    area: '50 ha',
    status: 'planted',
    progress: 20,
    plantedDate: '2024-11-20',
    harvestDate: '2025-02-20',
    health: 'good',
    irrigation: 'Automatica',
    color: '#b45309',
    gradient: 'from-orange-500 to-amber-600',
    Icon: FeijaoIcon
  },
  {
    id: 5,
    name: 'Algodao',
    variety: 'FM 966',
    area: '50 ha',
    status: 'growing',
    progress: 55,
    plantedDate: '2024-09-01',
    harvestDate: '2025-04-01',
    health: 'excellent',
    irrigation: 'Pivo Central',
    color: '#84cc16',
    gradient: 'from-lime-400 to-green-500',
    Icon: AlgodaoIcon
  },
  {
    id: 6,
    name: 'Cana-de-Acucar',
    variety: 'RB867515',
    area: '100 ha',
    status: 'growing',
    progress: 70,
    plantedDate: '2024-04-15',
    harvestDate: '2025-05-15',
    health: 'good',
    irrigation: 'Automatica',
    color: '#4ade80',
    gradient: 'from-green-400 to-emerald-500',
    Icon: CanaIcon
  }
]

const statusConfig = {
  planted: { label: 'Plantado', color: 'bg-sky-100 text-sky-700', icon: Calendar },
  growing: { label: 'Crescimento', color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
  harvest: { label: 'Colheita', color: 'bg-amber-100 text-amber-700', icon: CheckCircle }
}

const healthConfig = {
  excellent: { label: 'Excelente', color: 'text-emerald-600', bg: 'bg-emerald-500' },
  good: { label: 'Bom', color: 'text-green-600', bg: 'bg-green-500' },
  warning: { label: 'Atencao', color: 'text-amber-600', bg: 'bg-amber-500' },
  critical: { label: 'Critico', color: 'text-red-600', bg: 'bg-red-500' }
}

export function CropManagement({ compact = false, culturas, onCulturaCreated }: CropManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedCultura, setEditedCultura] = useState<CulturaRequest | null>(null)
  const [novaCultura, setNovaCultura] = useState<CulturaRequest>({
    nome: '',
    area: 0,
    dataPlantio: new Date().toISOString().split('T')[0],
    previsaoColheita: undefined,
    icone: 'soja',
    progress: 0
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const iconOptions = [
    { value: 'soja', label: 'Soja', Icon: SojaIcon },
    { value: 'milho', label: 'Milho', Icon: MilhoIcon },
    { value: 'cafe', label: 'Cafe', Icon: CafeIcon },
    { value: 'feijao', label: 'Feijao', Icon: FeijaoIcon },
    { value: 'algodao', label: 'Algodao', Icon: AlgodaoIcon },
    { value: 'cana', label: 'Cana', Icon: CanaIcon },
    { value: 'arroz', label: 'Arroz', Icon: ArrozIcon },
    { value: 'trigo', label: 'Trigo', Icon: TrigoIcon },
    { value: 'abacaxi', label: 'Abacaxi', Icon: AbacaxiIcon },
    { value: 'banana', label: 'Banana', Icon: BananaIcon },
    { value: 'laranja', label: 'Laranja', Icon: LaranjaIcon },
    { value: 'manga', label: 'Manga', Icon: MangaIcon },
    { value: 'uva', label: 'Uva', Icon: UvaIcon },
    { value: 'melancia', label: 'Melancia', Icon: MelanciaIcon },
    { value: 'tomate', label: 'Tomate', Icon: TomateIcon },
    { value: 'batata', label: 'Batata', Icon: BatataIcon },
  ]

  const getIconComponent = (iconName: string | null | undefined): React.ComponentType<{ className?: string }> => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'soja': SojaIcon,
      'milho': MilhoIcon,
      'cafe': CafeIcon,
      'feijao': FeijaoIcon,
      'algodao': AlgodaoIcon,
      'cana': CanaIcon,
      'arroz': ArrozIcon,
      'trigo': TrigoIcon,
      'abacaxi': AbacaxiIcon,
      'banana': BananaIcon,
      'laranja': LaranjaIcon,
      'manga': MangaIcon,
      'uva': UvaIcon,
      'melancia': MelanciaIcon,
      'tomate': TomateIcon,
      'batata': BatataIcon,
    }
    return iconMap[iconName || ''] || GenericCropIcon
  }

  const handleCriarCultura = async () => {
    if (!novaCultura.nome || !novaCultura.area) return

    try {
      setIsLoading(true)
      setErrorMessage(null)
      
      const payload = { ...novaCultura }
      if (!payload.previsaoColheita) {
        delete payload.previsaoColheita
      }

      await api.culturas.create(payload)
      setIsDialogOpen(false)
      setNovaCultura({ nome: '', area: 0, dataPlantio: new Date().toISOString().split('T')[0], previsaoColheita: undefined, icone: 'soja', progress: 0 })
      onCulturaCreated?.()
    } catch (error: any) {
      console.error('Erro ao criar cultura:', error)
      // Nao mostra mensagem de erro se for redirecionamento por token expirado
      if (error.status !== 401) {
        setErrorMessage(error.message || 'Erro ao criar cultura. Verifique os dados e tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const crops = culturas || defaultCrops

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = (crop.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || crop.status === filter
    return matchesSearch && matchesFilter
  })

  const displayCrops = compact ? filteredCrops.slice(0, 4) : filteredCrops

  return (
    <Card className="border border-[#dce8df] shadow-sm overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#edf3ef] bg-[#f9fcfa]">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </motion.div>
          Gestao de Culturas
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setErrorMessage(null)
          }
        }}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Cultura
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Cultura</DialogTitle>
              <DialogDescription>
                Adicione uma nova cultura ao seu cadastro
              </DialogDescription>
            </DialogHeader>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="nome" className="text-sm font-medium">Nome da Cultura</label>
                <Input
                  id="nome"
                  placeholder="Ex: Soja, Milho, Cafe..."
                  value={novaCultura.nome}
                  onChange={(e) => setNovaCultura({ ...novaCultura, nome: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="area" className="text-sm font-medium">Area (ha)</label>
                <Input
                  id="area"
                  type="number"
                  placeholder="Ex: 100"
                  value={novaCultura.area || ''}
                  onChange={(e) => setNovaCultura({ ...novaCultura, area: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="dataPlantio" className="text-sm font-medium">Data de Plantio</label>
                <Input
                  id="dataPlantio"
                  type="date"
                  value={novaCultura.dataPlantio}
                  onChange={(e) => setNovaCultura({ ...novaCultura, dataPlantio: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="previsaoColheita" className="text-sm font-medium">Previsão de Colheita</label>
                <Input
                  id="previsaoColheita"
                  type="date"
                  value={novaCultura.previsaoColheita || ''}
                  onChange={(e) => setNovaCultura({ ...novaCultura, previsaoColheita: e.target.value || undefined })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Progresso Inicial: {novaCultura.progress || 0}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={novaCultura.progress || 0}
                  onChange={(e) => setNovaCultura({ ...novaCultura, progress: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ícone</label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.Icon
                    const isSelected = novaCultura.icone === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setNovaCultura({ ...novaCultura, icone: option.value })}
                        className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <IconComponent className="w-8 h-8" />
                        <span className="text-xs text-gray-600">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button 
                onClick={handleCriarCultura} 
                disabled={isLoading || !novaCultura.nome || !novaCultura.area}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Criar Cultura
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Cultura</DialogTitle>
              <DialogDescription>
                Atualize as informações da cultura
              </DialogDescription>
            </DialogHeader>
            {editedCultura && selectedCrop && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={editedCultura.nome}
                    onChange={(e) => setEditedCultura({ ...editedCultura, nome: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Area (ha)</label>
                  <Input
                    type="number"
                    value={editedCultura.area || ''}
                    onChange={(e) => setEditedCultura({ ...editedCultura, area: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Data de Plantio</label>
                  <Input
                    type="date"
                    value={editedCultura.dataPlantio}
                    onChange={(e) => setEditedCultura({ ...editedCultura, dataPlantio: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Previsão de Colheita</label>
                  <Input
                    type="date"
                    value={editedCultura.previsaoColheita || ''}
                    onChange={(e) => setEditedCultura({ ...editedCultura, previsaoColheita: e.target.value || undefined })}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Progresso: {editedCultura.progress || 0}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editedCultura.progress || 0}
                    onChange={(e) => setEditedCultura({ ...editedCultura, progress: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Ícone</label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((option) => {
                      const IconComponent = option.Icon
                      const isSelected = editedCultura.icone === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setEditedCultura({ ...editedCultura, icone: option.value })}
                          className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                            isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <IconComponent className="w-8 h-8" />
                          <span className="text-xs text-gray-600">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button 
                onClick={async () => {
                  if (!selectedCrop || !editedCultura) return
                  try {
                    setIsLoading(true)
                    await api.culturas.update(selectedCrop.id, editedCultura)
                    setIsEditDialogOpen(false)
                    onCulturaCreated?.()
                  } catch (error) {
                    console.error('Erro ao atualizar cultura:', error)
                  } finally {
                    setIsLoading(false)
                  }
                }}
                disabled={isLoading || !editedCultura?.nome || !editedCultura?.area}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <motion.div 
            className="relative flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar culturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
            />
          </motion.div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-[#eff5f1] border border-[#dce8df]">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Todas</TabsTrigger>
              <TabsTrigger value="growing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Crescendo</TabsTrigger>
              <TabsTrigger value="harvest" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Colheita</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Crops Grid */}
        <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          <AnimatePresence mode="popLayout">
            {displayCrops.map((crop, index) => {
              const status = statusConfig[crop.status as keyof typeof statusConfig]
              const health = healthConfig[crop.health as keyof typeof healthConfig]
              const StatusIcon = status.icon
              const CropIcon = crop.Icon || getIconComponent(crop.icone || crop.name)

              return (
                <motion.div
                  key={crop.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 100 
                  }}
                >
                  <div>
                    <Card className="border border-[#dce8df] hover:shadow-md transition-shadow duration-300 overflow-hidden bg-white">
                      <CardContent className="p-0">
                        {/* Header */}
                        <div className="p-4 border-b border-[#edf3ef]" style={{ borderTop: `4px solid ${crop.color}` }}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {/* Floating Icon */}
                              <motion.div 
                                className="p-2 bg-[#f2f7f3] rounded-lg"
                                animate={{ 
                                  y: [0, -5, 0],
                                  rotateZ: [0, 2, -2, 0]
                                }}
                                transition={{ 
                                  duration: 4, 
                                  repeat: Infinity, 
                                  ease: 'easeInOut',
                                  delay: index * 0.2
                                }}
                              >
                                <CropIcon className="w-10 h-10" />
                              </motion.div>
                              <div>
                                <h3 className="font-semibold text-slate-800 text-base">{crop.name}</h3>
                                <p className="text-sm text-slate-500">{crop.variety}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-100">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                   setSelectedCrop(crop)
                                   setEditedCultura({
                                     nome: crop.name,
                                     area: parseFloat(crop.area.replace(' ha', '')),
                                     dataPlantio: crop.plantedDate,
                                     previsaoColheita: crop.harvestDate || undefined,
                                     icone: crop.icone,
                                     progress: crop.progress
                                   })
                                   setIsEditDialogOpen(true)
                                 }}>
                                   Editar Cultura
                                 </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => {
                                   setSelectedCrop(crop)
                                   setEditedCultura({
                                     nome: crop.name,
                                     area: parseFloat(crop.area.replace(' ha', '')),
                                     dataPlantio: crop.plantedDate,
                                     previsaoColheita: crop.harvestDate || undefined,
                                     icone: crop.icone,
                                     progress: crop.progress
                                   })
                                   setIsEditDialogOpen(true)
                                 }}>
                                   Atualizar Progresso
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={async () => {
                                  if (confirm(`Tem certeza que deseja excluir "${crop.name}"?`)) {
                                    try {
                                      await api.culturas.delete(crop.id)
                                      onCulturaCreated?.()
                                    } catch (error) {
                                      console.error('Erro ao excluir cultura:', error)
                                    }
                                  }
                                }}>
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                          {/* Status and Area */}
                          <div className="flex items-center justify-between">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <Badge className={`${status.color} shadow-sm`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </motion.div>
                            <span className="text-sm font-bold text-gray-600">{crop.area}</span>
                          </div>

                          {/* Progress with 3D effect */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 font-medium">Progresso</span>
                              <motion.span 
                                className="font-bold text-gray-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={crop.progress}
                              >
                                {crop.progress}%
                              </motion.span>
                            </div>
                            <Progress3D value={crop.progress} color={crop.color} />
                          </div>

                          {/* Health Indicator */}
                          <div className="flex items-center justify-between">
                            <motion.div 
                              className="flex items-center gap-2"
                              whileHover={{ scale: 1.02 }}
                            >
                              {crop.health === 'warning' ? (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 500 }}
                                >
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                </motion.div>
                              )}
                              <span className={`text-sm font-medium ${health.color}`}>
                                {health.label}
                              </span>
                            </motion.div>
                            <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                              <Droplets className="w-3 h-3" />
                              <span className="text-xs font-medium">{crop.irrigation}</span>
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                               <Calendar className="w-3 h-3" />
                               <span>Plantio: {formatDate(crop.plantedDate, 'N/A')}</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <Clock className="w-3 h-3" />
                               <span>Colheita: {formatDate(crop.harvestDate)}</span>
                             </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {compact && crops.length > 4 && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button variant="outline" className="text-emerald-700 border-[#d5e4da] hover:bg-emerald-50">
              Ver Todas as Culturas ({crops.length})
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

