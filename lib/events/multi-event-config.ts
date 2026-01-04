export interface SubEvent {
  id: string
  name: string
  fee: number
  iiserkFee?: number
  type: 'individual' | 'team'
  minTeamSize?: number
  maxTeamSize?: number
  description?: string
  requiresMembers?: boolean
}

export interface MultiEventConfig {
  id: string
  name: string
  tableName: string
  emailFrom: string
  isMultiEvent: true
  allowMultipleSubEvents: boolean
  subEvents: SubEvent[]
}

export const MULTI_EVENT_CONFIGS: Record<string, MultiEventConfig> = {
  'soulbeats': {
    id: 'soulbeats',
    name: 'Soulbeats',
    tableName: 'event_registrations_soulbeats',
    emailFrom: 'soulbeats@inquivesta.in',
    isMultiEvent: true,
    allowMultipleSubEvents: true,
    subEvents: [
      {
        id: 'x-press',
        name: 'X-Press (Group Dance)',
        fee: 400,
        type: 'team',
        minTeamSize: 2,
        maxTeamSize: 10,
        description: 'Group dance competition with pre-rehearsed performances',
        requiresMembers: true
      },
      {
        id: 'survival',
        name: 'Survival of the Fittest',
        fee: 200,
        type: 'individual',
        description: 'Solo dance battle - show your moves on the spot!'
      },
      {
        id: 'workshop',
        name: 'Dance Workshop',
        fee: 0,
        type: 'individual',
        description: 'Free workshop - Learn from professional dancers'
      }
    ]
  },
  'bullseye': {
    id: 'bullseye',
    name: 'Bullseye',
    tableName: 'event_registrations_bullseye',
    emailFrom: 'bullseye@inquivesta.in',
    isMultiEvent: true,
    allowMultipleSubEvents: true,
    subEvents: [
      {
        id: 'dartshot',
        name: 'DartShot (Archery)',
        fee: 69,
        type: 'individual',
        description: 'Precision-based archery challenge'
      },
      {
        id: 'tic-tac-target',
        name: 'Tic Tac Target',
        fee: 99,
        type: 'individual',
        description: 'Strategic archery Tic-Tac-Toe on a giant 3×3 board'
      }
    ]
  }
}

export const MULTI_EVENTS = Object.keys(MULTI_EVENT_CONFIGS)

export function getMultiEventConfig(eventId: string): MultiEventConfig | null {
  return MULTI_EVENT_CONFIGS[eventId] || null
}

export function isMultiEvent(eventId: string): boolean {
  return MULTI_EVENTS.includes(eventId)
}
