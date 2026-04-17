'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, Menu, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import api, { NotificacaoResponse } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const [notificacoes, setNotificacoes] = useState<NotificacaoResponse[]>([])
  const [contagemNaoLidas, setContagemNaoLidas] = useState(0)
  const [isLoadingNotificacoes, setIsLoadingNotificacoes] = useState(false)

  useEffect(() => {
    if (user?.id) {
      carregarNotificacoes()
    }
  }, [user?.id])

  const carregarNotificacoes = async () => {
    if (!user?.id) return

    setIsLoadingNotificacoes(true)
    try {
      const [todas, contagem] = await Promise.all([
        api.notificacoes.getAll(),
        api.notificacoes.getContagem()
      ])
      setNotificacoes(todas.slice(0, 10))
      setContagemNaoLidas(contagem.quantidade)
    } catch (error) {
      console.error('Erro ao carregar notificacoes:', error)
    } finally {
      setIsLoadingNotificacoes(false)
    }
  }

  const formatarTempo = (dataString: string) => {
    const data = new Date(dataString)
    const agora = new Date()
    const diffMs = agora.getTime() - data.getTime()
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffHoras / 24)

    if (diffHoras < 1) return 'Agora mesmo'
    if (diffHoras < 24) return `Ha ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
    if (diffDias === 1) return 'Ontem'
    return `Ha ${diffDias} dias`
  }

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case 'ALERTA': return 'text-red-600'
      case 'AVISO': return 'text-amber-600'
      case 'SUCESSO': return 'text-emerald-600'
      default: return 'text-blue-600'
    }
  }

  const handleMarcarComoLida = async (id: number) => {
    try {
      await api.notificacoes.marcarComoLida(id)
      setNotificacoes(prev => prev.map(n =>
        n.id === id ? { ...n, lida: true } : n
      ))
      setContagemNaoLidas(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const handleMarcarTodasLidas = async () => {
    if (!user?.id) return
    try {
      await api.notificacoes.marcarTodasComoLidas()
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
      setContagemNaoLidas(0)
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#dce8df] bg-[#f7faf8]/95 backdrop-blur">
      <div className="mx-auto w-full max-w-[1540px] px-4 md:px-6 lg:px-7">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-white"
              onClick={onMenuClick}
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </Button>

            <div>
              <h2 className="text-base md:text-lg font-semibold text-slate-800">
                Dashboard
              </h2>
              <p className="hidden md:block text-xs text-slate-500">
                Visao geral da fazenda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Pesquisar..."
                className="pl-10 w-64 bg-white border-[#d9e6dc] focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-white">
                  <Bell className="w-5 h-5 text-slate-600" />
                  {contagemNaoLidas > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center bg-red-500 text-white text-xs">
                      {contagemNaoLidas > 9 ? '9+' : contagemNaoLidas}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between px-2">
                  <DropdownMenuLabel className="py-2">Notificacoes</DropdownMenuLabel>
                  {contagemNaoLidas > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-emerald-600 h-auto py-1"
                      onClick={handleMarcarTodasLidas}
                    >
                      Marcar todas
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />

                {isLoadingNotificacoes ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  </div>
                ) : notificacoes.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma notificacao</p>
                  </div>
                ) : (
                  notificacoes.map((notificacao) => (
                    <DropdownMenuItem
                      key={notificacao.id}
                      className={`flex flex-col items-start gap-1 py-3 cursor-pointer ${!notificacao.lida ? 'bg-emerald-50/50' : ''}`}
                      onClick={() => !notificacao.lida && handleMarcarComoLida(notificacao.id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className={`text-slate-800 ${!notificacao.lida ? 'font-semibold' : 'font-medium'}`}>
                          {notificacao.titulo}
                        </span>
                        {!notificacao.lida && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 ml-auto" />
                        )}
                      </div>
                      {notificacao.mensagem && (
                        <span className="text-xs text-slate-500">{notificacao.mensagem}</span>
                      )}
                      <span className={`text-xs ${getTipoCor(notificacao.tipo)}`}>
                        {formatarTempo(notificacao.dataCriacao)}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-white">
                  <Avatar className="h-8 w-8 border border-[#d9e6dc]">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-emerald-600 text-white font-medium text-sm">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-800">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-slate-500">{user?.role || 'Usuario'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuracoes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

