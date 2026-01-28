export interface EventConfig {
  id: string
  name: string
  slug: string
  isTeamEvent: boolean
  minTeamSize: number
  maxTeamSize: number
  fee: number
  registrationOpen: boolean
  registrationDeadline: string
  tableName: string
  emailFrom: string
  // Custom fields for each event
  customFields?: string[]
}

export const eventConfigs: Record<string, EventConfig> = {
  botprix: {
    id: "botprix",
    name: "Botprix",
    slug: "botprix",
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    fee: 100,
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_botprix",
    emailFrom: "botprix@inquivesta.in",
  },
  csi: {
    id: "csi",
    name: "CSI - Crime Scene Investigation",
    slug: "csi",
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 4,
    fee: 120,
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_csi",
    emailFrom: "csi@inquivesta.in",
    customFields: ["played_csi_before", "agrees_to_rules"],
  },
  "junkyard-wars": {
    id: "junkyard-wars",
    name: "Junkyard Wars",
    slug: "junkyard-wars",
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 3,
    fee: 99,
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_junkyard_wars",
    emailFrom: "junkyard-wars@inquivesta.in",
  },
  inquizzitive: {
    id: "inquizzitive",
    name: "Inquizzitive",
    slug: "inquizzitive",
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 3,
    fee: 150,
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_inquizzitive",
    emailFrom: "inquizzitive@inquivesta.in",
  },
  "beat-the-drop": {
    id: "beat-the-drop",
    name: "Beat the Drop",
    slug: "beat-the-drop",
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    fee: 50,
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_beat_the_drop",
    emailFrom: "beat-the-drop@inquivesta.in",
  },
  thrust: {
    id: "thrust",
    name: "Thrust",
    slug: "thrust",
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 4,
    fee: 50, // Default fee, actual is 30 for IISER/School, 50 for others
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_thrust",
    emailFrom: "thrust@inquivesta.in",
    customFields: ["will_bring_bottle", "is_iiserk_or_school"],
  },
  "headshot-bgmi": {
    id: "headshot-bgmi",
    name: "Headshot - BGMI",
    slug: "headshot-bgmi",
    isTeamEvent: true,
    minTeamSize: 5,
    maxTeamSize: 5,
    fee: 100,
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_headshot_bgmi",
    emailFrom: "headshot@inquivesta.in",
  },
  "headshot-valorant": {
    id: "headshot-valorant",
    name: "Headshot - Valorant",
    slug: "headshot-valorant",
    isTeamEvent: true,
    minTeamSize: 4,
    maxTeamSize: 4,
    fee: 500,
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_headshot_valorant",
    emailFrom: "headshot@inquivesta.in",
  },
  lost: {
    id: "lost",
    name: "L.O.S.T",
    slug: "lost",
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 4,
    fee: 160, // Default fee, actual is 120 for IISER, 160 for others
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_lost",
    emailFrom: "lost@inquivesta.in",
    customFields: ["is_iiserk"],
  },
  photon: {
    id: "photon",
    name: "Photon",
    slug: "photon",
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 0, // Free event
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_photon",
    emailFrom: "photon@inquivesta.in",
  },
  "art-in-a-culture": {
    id: "art-in-a-culture",
    name: "Art in a Culture",
    slug: "art-in-a-culture",
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 50,
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_art_in_a_culture",
    emailFrom: "art-in-a-culture@inquivesta.in",
  },
  "hoop-hustle": {
    id: "hoop-hustle",
    name: "Hoop Hustle",
    slug: "hoop-hustle",
    isTeamEvent: true,
    minTeamSize: 4,
    maxTeamSize: 4,
    fee: 200, // Default fee, actual is 100 for IISER K teams
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_hoop_hustle",
    emailFrom: "hoop-hustle@inquivesta.in",
    customFields: ["is_iiserk_team"],
  },
  "inquicon": {
    id: "inquicon",
    name: "Inquicon Pass",
    slug: "inquicon",
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 50, // Default fee, actual is 30 for IISER K (internal)
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_inquicon",
    emailFrom: "inquicon@inquivesta.in",
    customFields: ["pass_type", "events_participation"],
  },
  "table-tennis-singles": {
    id: "table-tennis-singles",
    name: "Table Tennis Singles",
    slug: "table-tennis-singles",
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 100, // Default fee, actual is 30 for IISER K
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_table_tennis_singles",
    emailFrom: "table-tennis@inquivesta.in",
    customFields: ["category"],
  },
  "table-tennis-doubles": {
    id: "table-tennis-doubles",
    name: "Table Tennis Doubles",
    slug: "table-tennis-doubles",
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 2,
    fee: 200, // Default fee, actual is 60 for IISER K
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_table_tennis_doubles",
    emailFrom: "table-tennis@inquivesta.in",
    customFields: ["category", "partner_name", "partner_phone"],
  },
  masquerade: {
    id: "masquerade",
    name: "Masquerade",
    slug: "masquerade",
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 2,
    fee: 169, // Couple: 169, Single Male: 91, Single Female: 52
    registrationOpen: true,
    registrationDeadline: "2026-02-01",
    tableName: "event_registrations_masquerade",
    emailFrom: "masquerade@inquivesta.in",
    customFields: ["pass_type", "gender", "partner"],
  },
  "day-passes": {
    id: "day-passes",
    name: "Day Passes",
    slug: "day-passes",
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 299, // Day 2/3: 299, All days: 499
    registrationOpen: true,
    registrationDeadline: "2026-02-08",
    tableName: "event_registrations_day_passes",
    emailFrom: "events@inquivesta.in",
    customFields: ["pass_type", "pass_name", "pass_date"],
  },
}

export function isIISERKEmail(email: string): boolean {
  return email.toLowerCase().endsWith("@iiserkol.ac.in")
}

export function getEventConfig(eventId: string): EventConfig | undefined {
  return eventConfigs[eventId]
}
