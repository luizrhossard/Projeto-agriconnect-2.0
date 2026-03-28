'use client'

import { cn } from '@/lib/utils'
import type { ComponentType } from 'react'
import {
  Apple,
  Banana,
  Bean,
  Cherry,
  Coffee,
  Grape,
  Leaf,
  LeafyGreen,
  Sprout,
  Wheat,
} from 'lucide-react'

interface CropIconProps {
  className?: string
}

type IconComponent = ComponentType<{
  className?: string
  strokeWidth?: number
}>

function MinimalIcon({
  Icon,
  className,
}: {
  Icon: IconComponent
  className?: string
}) {
  return (
    <Icon
      strokeWidth={1.9}
      className={cn('w-8 h-8 text-emerald-700', className)}
    />
  )
}

export function SojaIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Sprout} className={className} />
}

export function MilhoIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Wheat} className={className} />
}

export function CafeIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Coffee} className={className} />
}

export function FeijaoIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Bean} className={className} />
}

export function AlgodaoIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={LeafyGreen} className={className} />
}

export function CanaIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Leaf} className={className} />
}

export function ArrozIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Wheat} className={className} />
}

export function TrigoIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Wheat} className={className} />
}

export function AbacaxiIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={LeafyGreen} className={className} />
}

export function BananaIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Banana} className={className} />
}

export function LaranjaIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Apple} className={className} />
}

export function MangaIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Apple} className={className} />
}

export function UvaIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Grape} className={className} />
}

export function MelanciaIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Cherry} className={className} />
}

export function TomateIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Cherry} className={className} />
}

export function BatataIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Bean} className={className} />
}

export function GenericCropIcon({ className }: CropIconProps) {
  return <MinimalIcon Icon={Sprout} className={className} />
}
