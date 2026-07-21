import { useQuery } from '@hanzo/base/react'
import { YStack, XStack, Text, Paragraph, Spinner, Circle } from '@hanzo/gui'
import { rally } from '../theme'
import { tally, type Rsvp } from '../lib/rsvp'
import { useEvent } from '../lib/event'
import { Pill } from './ui'

function Stat({ n, label, tint }: { n: number; label: string; tint: string }) {
  return (
    <YStack
      flex={1}
      backgroundColor={rally.inkSoft}
      borderRadius={20}
      borderWidth={1}
      borderColor="rgba(255,255,255,0.06)"
      padding={18}
      gap="$1"
    >
      <Text fontSize={34} fontWeight="900" color={tint}>
        {n}
      </Text>
      <Text fontSize={12} fontWeight="800" letterSpacing={1} textTransform="uppercase" color={rally.onInkDim}>
        {label}
      </Text>
    </YStack>
  )
}

function Row({ r }: { r: Rsvp }) {
  const going = r.status === 'yes'
  const initial = (r.name || '?').trim().charAt(0).toUpperCase()
  return (
    <XStack
      alignItems="center"
      gap="$3"
      padding={16}
      backgroundColor={rally.inkSoft}
      borderRadius={18}
      borderWidth={1}
      borderColor="rgba(255,255,255,0.06)"
    >
      <Circle size={44} backgroundColor={going ? rally.accent : 'rgba(255,255,255,0.12)'}>
        <Text fontSize={18} fontWeight="900" color={going ? rally.onAccent : rally.onInkDim}>
          {initial}
        </Text>
      </Circle>
      <YStack flex={1} gap="$1">
        <XStack alignItems="center" gap="$2" flexWrap="wrap">
          <Text fontSize={16} fontWeight="800" color={rally.cream}>
            {r.name || 'Guest'}
          </Text>
          {going && r.guests > 0 ? (
            <Text fontSize={13} fontWeight="700" color={rally.accentSoft}>
              +{r.guests}
            </Text>
          ) : null}
        </XStack>
        {r.email ? (
          <Text fontSize={13} color={rally.onInkDim}>
            {r.email}
          </Text>
        ) : null}
        {r.note ? (
          <Text fontSize={14} color={rally.onAccentDim} marginTop={2}>
            “{r.note}”
          </Text>
        ) : null}
      </YStack>
      {going ? (
        <Pill background="rgba(29,185,84,0.16)" color={rally.good}>
          GOING
        </Pill>
      ) : (
        <Pill background="rgba(255,255,255,0.10)" color={rally.onInkDim}>
          CAN'T
        </Pill>
      )}
    </XStack>
  )
}

/** Host view: the counts up top, then every reply as it lands. */
export function Attendees() {
  const { event } = useEvent()
  const { data, isLoading, error } = useQuery<Rsvp>('rsvps', { sort: '-created', realtime: false })
  const rsvps = data ?? []
  const t = tally(rsvps)
  const spotsLeft = Math.max(0, event.capacity - t.heads)

  return (
    <YStack gap="$5" width="100%" maxWidth={640} alignSelf="center" paddingVertical={28} paddingHorizontal={20}>
      <YStack gap="$2">
        <Text fontSize={13} fontWeight="900" letterSpacing={2} color={rally.accent}>
          GUEST LIST
        </Text>
        <Text fontSize={30} fontWeight="900" letterSpacing={-0.5} color={rally.cream}>
          {event.title}
        </Text>
      </YStack>

      <XStack gap="$3">
        <Stat n={t.heads} label="Heads coming" tint={rally.accent} />
        <Stat n={t.going} label="Replied yes" tint={rally.cream} />
        <Stat n={spotsLeft} label="Spots left" tint={rally.gold} />
      </XStack>

      {isLoading ? (
        <XStack gap="$2" alignItems="center" opacity={0.7} paddingVertical={20}>
          <Spinner color={rally.accent} /> <Text color={rally.onInkDim}>Loading replies…</Text>
        </XStack>
      ) : error ? (
        <Paragraph color={rally.ember}>
          Couldn't reach Base ({error.message}). Confirm VITE_HANZO_BASE_URL and that you're signed in.
        </Paragraph>
      ) : rsvps.length === 0 ? (
        <YStack
          alignItems="center"
          gap="$2"
          paddingVertical={44}
          backgroundColor={rally.inkSoft}
          borderRadius={22}
          borderWidth={1}
          borderColor="rgba(255,255,255,0.06)"
        >
          <Text fontSize={34}>🎟️</Text>
          <Text fontSize={17} fontWeight="800" color={rally.cream}>
            No replies yet
          </Text>
          <Paragraph fontSize={14} color={rally.onInkDim} textAlign="center" maxWidth={320}>
            Share the event page and RSVPs will show up here the moment guests respond.
          </Paragraph>
        </YStack>
      ) : (
        <YStack gap="$3">
          {rsvps.map((r) => (
            <Row key={r.id} r={r} />
          ))}
        </YStack>
      )}
    </YStack>
  )
}
