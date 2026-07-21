import type { BaseRecord } from '@hanzo/base/react'

export type RsvpStatus = 'yes' | 'no'

/** One row of the `rsvps` collection provisioned from schema.sql. */
export interface Rsvp extends BaseRecord {
  name: string
  email: string
  status: RsvpStatus
  guests: number
  note: string
}

export interface Tally {
  going: number
  notGoing: number
  /** Total heads coming = one per "yes" plus their extra guests. */
  heads: number
}

/** Fold a list of RSVPs into the three numbers the host and hero care about. */
export function tally(rsvps: Rsvp[]): Tally {
  let going = 0
  let notGoing = 0
  let heads = 0
  for (const r of rsvps) {
    if (r.status === 'yes') {
      going += 1
      heads += 1 + Math.max(0, r.guests || 0)
    } else {
      notGoing += 1
    }
  }
  return { going, notGoing, heads }
}
