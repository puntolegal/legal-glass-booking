import type { InmobiliarioQualification } from '@/constants/inmobiliarioQualification'

export type MockOrienteAddress = {
  id: string
  label: string
  comuna: InmobiliarioQualification['ubicacion']
  /** Coordenadas aproximadas para UI (no georreferencia oficial) */
  lat: string
  lng: string
}

/** Sugerencias simuladas estilo Places (Sector Oriente) — sin API externa. */
export const INMOB_MOCK_ADDRESSES: MockOrienteAddress[] = [
  {
    id: '1',
    label: 'Av. Apoquindo 4500, Las Condes',
    comuna: 'las_condes',
    lat: '-33.4089',
    lng: '-70.5762',
  },
  {
    id: '2',
    label: 'Av. Apoquindo 3000, Las Condes',
    comuna: 'las_condes',
    lat: '-33.4142',
    lng: '-70.5821',
  },
  {
    id: '3',
    label: 'Alonso de Córdova 5870, Vitacura',
    comuna: 'vitacura',
    lat: '-33.3911',
    lng: '-70.5734',
  },
  {
    id: '4',
    label: 'Av. Vitacura 5250, Vitacura',
    comuna: 'vitacura',
    lat: '-33.3988',
    lng: '-70.5691',
  },
  {
    id: '5',
    label: 'La Dehesa 1442, Lo Barnechea',
    comuna: 'lo_barnechea',
    lat: '-33.3572',
    lng: '-70.5148',
  },
  {
    id: '6',
    label: 'Av. La Dehesa 1800, Lo Barnechea',
    comuna: 'lo_barnechea',
    lat: '-33.3521',
    lng: '-70.5089',
  },
  {
    id: '7',
    label: 'Av. El Rodeo 14200, Lo Barnechea',
    comuna: 'lo_barnechea',
    lat: '-33.3289',
    lng: '-70.4891',
  },
  {
    id: '8',
    label: 'Av. Las Condes 12400, La Reina',
    comuna: 'la_reina',
    lat: '-33.4482',
    lng: '-70.5367',
  },
  {
    id: '9',
    label: 'Av. Ossandón 1010, La Reina',
    comuna: 'la_reina',
    lat: '-33.4511',
    lng: '-70.5412',
  },
  {
    id: '10',
    label: 'Av. Kennedy 9101, Las Condes',
    comuna: 'las_condes',
    lat: '-33.4012',
    lng: '-70.5755',
  },
  {
    id: '11',
    label: 'El Golf 40, Las Condes',
    comuna: 'las_condes',
    lat: '-33.4178',
    lng: '-70.6073',
  },
  {
    id: '12',
    label: 'Nueva Costanera 4040, Vitacura',
    comuna: 'vitacura',
    lat: '-33.4029',
    lng: '-70.5958',
  },
  {
    id: '13',
    label: 'Monseñor Escrivá de Balaguer 5600, Vitacura',
    comuna: 'vitacura',
    lat: '-33.3867',
    lng: '-70.5461',
  },
  {
    id: '14',
    label: 'Av. Consistorial 5130, La Reina',
    comuna: 'la_reina',
    lat: '-33.4445',
    lng: '-70.5289',
  },
  {
    id: '15',
    label: 'Cerro Colorado 5240, Las Condes',
    comuna: 'las_condes',
    lat: '-33.4291',
    lng: '-70.5844',
  },
]

export function filterMockAddresses(query: string, limit = 6): MockOrienteAddress[] {
  const q = query.trim().toLowerCase()
  if (!q) return INMOB_MOCK_ADDRESSES.slice(0, limit)
  return INMOB_MOCK_ADDRESSES.filter((a) => a.label.toLowerCase().includes(q)).slice(0, limit)
}
