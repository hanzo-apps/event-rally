import { useIam } from '@hanzo/iam/react'
import { useQuery } from '@hanzo/base/react'
import { YStack, XStack, H1, Text, Paragraph, Circle, ScrollView } from '@hanzo/gui'
import { LinearGradient } from '@hanzo/gui/linear-gradient'
import { rally, heroGradient } from '../theme'
import { useEvent, eventDate } from '../lib/event'
import { tally, type Rsvp } from '../lib/rsvp'
import { RsvpForm } from './rsvp'
import { Cta } from './ui'

/** A dashed perforation with two punched notches — the ticket-stub seam. */
function Perforation() {
  return (
    <XStack height={30} alignItems="center" position="relative">
      <Circle size={30} backgroundColor={rally.ink} position="absolute" left={-15} />
      <YStack
        flex={1}
        marginHorizontal={22}
        borderTopWidth={2}
        borderStyle="dashed"
        borderColor={rally.creamEdge}
      />
      <Circle size={30} backgroundColor={rally.ink} position="absolute" right={-15} />
    </XStack>
  )
}

/**
 * The single-event page: a full-bleed flooded hero (date + title + place) with
 * a cream ticket stub floating over its lower edge. Public mode's stub CTA is a
 * PKCE sign-in; host mode's stub is the live RSVP form.
 */
export function EventPage({ mode }: { mode: 'public' | 'host' }) {
  const { login } = useIam()
  const { event } = useEvent()
  const { data } = useQuery<Rsvp>('rsvps', { sort: '-created', realtime: false })
  const d = eventDate(event.starts_at)
  const t = tally(data ?? [])
  const spotsLeft = Math.max(0, event.capacity - t.heads)

  const scarcity =
    t.heads > 0
      ? `${t.going} going · ${spotsLeft} ${spotsLeft === 1 ? 'spot' : 'spots'} left`
      : `Limited to ${event.capacity} spots`

  return (
    <ScrollView flex={1} backgroundColor={rally.ink}>
      <YStack minHeight="100vh" backgroundColor={rally.ink} alignItems="center">
        {/* ---- Hero: color-flooded date/title block ---- */}
        <YStack width="100%" position="relative" overflow="hidden" paddingBottom={96}>
          <LinearGradient
            fullscreen
            colors={heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <YStack
            width="100%"
            maxWidth={640}
            alignSelf="center"
            paddingHorizontal={24}
            paddingTop={72}
            gap="$5"
            zIndex={1}
          >
            <XStack
              alignSelf="flex-start"
              backgroundColor="rgba(255,255,255,0.16)"
              paddingHorizontal={14}
              paddingVertical={7}
              borderRadius={999}
            >
              <Text fontSize={12} fontWeight="900" letterSpacing={2} color={rally.onAccent}>
                YOU'RE INVITED
              </Text>
            </XStack>

            <YStack gap="$3">
              <XStack alignItems="center" gap="$3" flexWrap="wrap">
                <Text fontSize={30} fontWeight="900" letterSpacing={1} color={rally.onAccent}>
                  {d.valid ? `${d.weekday} · ${d.month} ${d.day}` : d.day}
                </Text>
                {d.valid ? (
                  <Text fontSize={30} fontWeight="900" color={rally.gold}>
                    {d.time}
                  </Text>
                ) : null}
              </XStack>

              <H1
                fontSize={54}
                lineHeight={56}
                fontWeight="900"
                letterSpacing={-1}
                color={rally.onAccent}
              >
                {event.title}
              </H1>

              <XStack alignItems="center" gap="$2">
                <Text fontSize={18}>📍</Text>
                <Text fontSize={17} fontWeight="700" color={rally.onAccentDim}>
                  {event.location}
                </Text>
              </XStack>
            </YStack>

            <Paragraph fontSize={17} lineHeight={26} color={rally.onAccentDim} maxWidth={520}>
              {event.description}
            </Paragraph>
          </YStack>
        </YStack>

        {/* ---- Ticket stub, floating over the hero's lower edge ---- */}
        <YStack
          width="100%"
          maxWidth={468}
          alignSelf="center"
          paddingHorizontal={20}
          marginTop={-72}
          zIndex={2}
          paddingBottom={40}
        >
          <YStack
            backgroundColor={rally.cream}
            borderRadius={28}
            position="relative"
            shadowColor="#000000"
            shadowOpacity={0.35}
            shadowRadius={40}
            shadowOffset={{ width: 0, height: 24 }}
          >
            {/* stub head */}
            <YStack padding={26} gap="$3">
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize={13} fontWeight="900" letterSpacing={3} color={rally.accentDeep}>
                  RALLY · RSVP
                </Text>
                <XStack
                  backgroundColor="rgba(255,46,126,0.12)"
                  paddingHorizontal={11}
                  paddingVertical={5}
                  borderRadius={999}
                >
                  <Text fontSize={12} fontWeight="800" color={rally.accentDeep}>
                    {scarcity}
                  </Text>
                </XStack>
              </XStack>
              <Text fontSize={24} fontWeight="900" letterSpacing={-0.3} color={rally.onCream}>
                {mode === 'host' ? 'Will you be there?' : 'Save your spot'}
              </Text>
              {mode === 'public' ? (
                <Paragraph fontSize={15} lineHeight={22} color={rally.onCreamDim}>
                  Reply yes or no in one tap. Sign in with Hanzo to send your RSVP — no password,
                  no app to install.
                </Paragraph>
              ) : null}
            </YStack>

            <Perforation />

            {/* stub action */}
            <YStack padding={26} paddingTop={22} gap="$3">
              {mode === 'host' ? (
                <RsvpForm />
              ) : (
                <>
                  <Cta label="Sign in to RSVP" height={60} fontSize={19} onPress={() => login()} />
                  <Text fontSize={12} fontWeight="600" textAlign="center" color={rally.onCreamDim}>
                    Secure sign-in via hanzo.id · hosts manage the guest list
                  </Text>
                </>
              )}
            </YStack>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
