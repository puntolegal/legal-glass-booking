import { NavLink } from 'react-router-dom'
import { Home, Calendar, FileText, User } from 'lucide-react'

const items = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/agendamiento?plan=general', label: 'Reservar', icon: Calendar },
  { to: '/servicios', label: 'Servicios', icon: FileText },
  { to: '/contacto', label: 'Contacto', icon: User },
]

export function TabBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-white/20 backdrop-blur-md bg-white/70 dark:bg-zinc-950/60">
      <ul className="grid grid-cols-4">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                'flex flex-col items-center py-2 text-xs min-h-[52px] transition-colors ' +
                (isActive 
                  ? 'font-semibold text-primary' 
                  : 'opacity-80 hover:opacity-100 text-gray-600 dark:text-gray-400'
                )
              }
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
