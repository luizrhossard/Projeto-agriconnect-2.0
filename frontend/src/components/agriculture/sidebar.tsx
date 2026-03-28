'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-emerald-400 to-green-500' },
  { id: 'crops', label: 'Culturas', icon: Sprout, color: 'from-green-400 to-emerald-500' },
  { id: 'market', label: 'Mercado', icon: TrendingUp, color: 'from-amber-400 to-orange-500' },
  { id: 'tasks', label: 'Tarefas', icon: ClipboardList, color: 'from-sky-400 to-blue-500' },
  { id: 'analytics', label: 'Análises', icon: BarChart3, color: 'from-purple-400 to-violet-500' },
]

export function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen }: SidebarProps) {
  const { logout, user } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 text-white transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        initial={false}
        style={{
          background: 'linear-gradient(180deg, #065f46 0%, #064e3b 50%, #022c22 100%)'
        }}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <motion.div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:40px_40px]"
              animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          
          {/* Floating orbs */}
          <motion.div 
            className="absolute -right-20 top-1/4 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute -left-20 bottom-1/4 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.3, 1, 1.3],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Logo */}
          <div className="relative z-10 p-4 border-b border-emerald-700/30">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative w-28 h-auto mb-2"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src="/logomarca.png"
                  alt="AgriConnect"
                  className="w-full h-auto drop-shadow-lg"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </motion.div>
            </motion.div>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 lg:hidden text-white hover:bg-emerald-700/50"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="relative z-10 flex-1 px-4 py-6">
            <nav className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 relative overflow-hidden group",
                      isActive 
                        ? "text-emerald-900" 
                        : "text-emerald-100 hover:bg-emerald-700/30"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active background */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-white shadow-lg"
                          layoutId="activeNav"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          style={{ borderRadius: 12 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Hover glow */}
                    {!isActive && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                        style={{ borderRadius: 12 }}
                      />
                    )}
                    
                    <motion.div
                      animate={isActive ? { 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative z-10"
                    >
                      <Icon className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-emerald-600" : "text-emerald-300 group-hover:text-white"
                      )} />
                    </motion.div>
                    
                    <span className={cn(
                      "font-medium relative z-10 transition-colors",
                      isActive ? "text-emerald-800" : "group-hover:text-white"
                    )}>
                      {item.label}
                    </span>
                    
                    {isActive && (
                      <motion.div
                        className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/50"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </nav>

            {/* Quick Stats */}
            <motion.div 
              className="mt-8 p-4 bg-emerald-700/20 backdrop-blur-sm rounded-xl border border-emerald-600/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-emerald-200 mb-3">Resumo Rápido</h3>
              <div className="space-y-3">
                {[
                  { label: 'Culturas Ativas', value: '12', color: 'from-emerald-400 to-green-500' },
                  { label: 'Área Total', value: '450 ha', color: 'from-amber-400 to-orange-500' },
                  { label: 'Colheita Est.', value: '15 dias', color: 'from-sky-400 to-blue-500' }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <span className="text-sm text-emerald-300/80">{stat.label}</span>
                    <motion.span 
                      className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </ScrollArea>

          {/* Footer */}
          <div className="relative z-10 p-4 border-t border-emerald-700/30">
            <nav className="space-y-2">
              <motion.button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-200 hover:bg-emerald-700/30 transition-all group"
                whileHover={{ x: 5 }}
              >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Configurações</span>
              </motion.button>
              <motion.button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-200 hover:bg-red-500/20 hover:text-red-300 transition-all group"
                whileHover={{ x: 5 }}
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Sair</span>
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
