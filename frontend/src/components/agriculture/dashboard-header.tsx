'use client'

import { motion } from 'framer-motion'
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

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-emerald-50"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>
          
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <motion.div
              className="relative w-12 h-auto"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/logomarca.png"
                alt="AgriConnect"
                className="w-full h-auto drop-shadow-md"
                style={{ mixBlendMode: 'multiply' }}
              />
            </motion.div>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-xl font-bold text-gray-800">
              Bem-vindo, <span className="text-emerald-600">Carlos Silva</span>
            </h2>
            <p className="text-sm text-gray-500">Fazenda São José • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Buscar culturas, tarefas..." 
              className="pl-10 w-64 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-emerald-50">
                <Bell className="w-5 h-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-gray-800">Irrigação necessária</span>
                <span className="text-xs text-gray-500">Setor 3 - Milho requer irrigação urgente</span>
                <span className="text-xs text-emerald-600">Há 2 horas</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-gray-800">Praga detectada</span>
                <span className="text-xs text-gray-500">Lavoura de soja - Área norte</span>
                <span className="text-xs text-emerald-600">Há 5 horas</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-gray-800">Preço atualizado</span>
                <span className="text-xs text-gray-500">Soja subiu 2.5% nas últimas 24h</span>
                <span className="text-xs text-emerald-600">Há 1 dia</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-emerald-50">
                <Avatar className="h-8 w-8 border-2 border-emerald-200">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-medium text-sm">
                    CS
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-800">Carlos Silva</p>
                  <p className="text-xs text-gray-500">Administrador</p>
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
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
