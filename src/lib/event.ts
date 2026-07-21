import { useQuery, type BaseRecord } from '@hanzo/base/react'

/** One row of the `event` collection provisioned from schema.sql. */
export interface EventRecord extends BaseRecord {
  title: string
  description: string
  starts_at: string
  location: string
  capacity: number
}

/** The shape the UI renders — a saved event, or the sample below. */
export type EventInfo = Pick<EventRecord, 'title' | 'description' | 'starts_at' | 'location' | 'capacity'>

/**
 * The event Rally ships with, shown on the public page and until a host saves
 * their own. It is a real sample — not a fabricated stat — so the pre-auth page
 * is a true preview of the layout.
 */
export const sampleEvent: EventInfo = {
  title: 'Midnight Rooftop Rally',
  description:
    'Rooftop DJs, skyline views, and one very good taco cart. Come celebrate the long weekend — dancing till late, bring your crew.',
  starts_at: '2026-08-15T20:00:00',
  location: 'The Ardent · 55 Mercer St',
  capacity: 120,
}

/**
 * Reads the single event from Base (most-recent wins) and falls back to the
 * sample when signed out or before a host has created one. `record` is the raw
 * Base row (null for the sample) so Edit knows whether to create or update.
 */
export function useEvent() {
  const { data, isLoading, error, refetch } = useQuery<EventRecord>('event', {
    sort: '-created',
    realtime: false,
  })
  const record = data[0] ?? null
  const event: EventInfo = record ?? sampleEvent
  return { event, record, isLoading, error, refetch }
}

const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTH = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

/** A calendar-block split of `starts_at`; falls back to the raw string. */
export function eventDate(startsAt: string) {
  const d = new Date(startsAt)
  if (Number.isNaN(d.getTime())) {
    return { weekday: '', day: startsAt, month: '', time: '', valid: false }
  }
  let h = d.getHours()
  const m = d.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  const time = m === 0 ? `${h}:00 ${ampm}` : `${h}:${String(m).padStart(2, '0')} ${ampm}`
  return {
    weekday: WEEKDAY[d.getDay()],
    day: String(d.getDate()),
    month: MONTH[d.getMonth()],
    time,
    valid: true,
  }
}
