import type { ComponentProps } from 'react'
import { LaboralThemeToggle } from '@/components/servicios/LaboralThemeToggle'

export function LandingThemeToggle(
  props: Omit<ComponentProps<typeof LaboralThemeToggle>, 'variant'>
) {
  return <LaboralThemeToggle {...props} variant="landing" />
}
