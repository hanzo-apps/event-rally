import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { YStack, XStack, Text, Button, Circle, ScrollView } from '@hanzo/gui'
import { rally } from '../theme'
import { EventPage } from './event'
import { Attendees } from './attendees'
import { Edit } from './edit'

type Tab = 'event' | 'guests' | 'edit'
const TABS: { id: Tab; label: string }[] = [
  { id: 'event', label: 'Event' },
  { id: 'guests', label: 'Guests' },
  { id: 'edit', label: 'Edit' },
]

function Tabs({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <XStack backgroundColor={rally.inkSoft} borderRadius={999} padding={4} gap={2}>
      {TABS.map(({ id, label }) => {
        const on = tab === id
        return (
          <Button
            key={id}
            size="$2"
            height={38}
            paddingHorizontal={16}
            borderRadius={999}
            backgroundColor={on ? rally.accent : 'transparent'}
            pressStyle={{ scale: 0.96 }}
            onPress={() => onTab(id)}
          >
            <Button.Text color={on ? rally.onAccent : rally.onInkDim} fontWeight="800" fontSize={14}>
              {label}
            </Button.Text>
          </Button>
        )
      })}
    </XStack>
  )
}

/** Signed-in host shell: a persistent nav over the three host views. */
export function Host() {
  const { logout } = useIam()
  const [tab, setTab] = useState<Tab>('event')

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={rally.ink}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={20}
        paddingVertical={12}
        borderBottomWidth={1}
        borderColor="rgba(255,255,255,0.07)"
        backgroundColor={rally.ink}
        flexWrap="wrap"
        gap="$3"
      >
        <XStack alignItems="center" gap="$2">
          <Circle size={26} backgroundColor={rally.accent} />
          <Text fontSize={19} fontWeight="900" letterSpacing={1} color={rally.cream}>
            RALLY
          </Text>
        </XStack>
        <XStack alignItems="center" gap="$3">
          <Tabs tab={tab} onTab={setTab} />
          <Button chromeless size="$2" height={38} onPress={() => logout()}>
            <Button.Text color={rally.onInkDim} fontWeight="700">
              Sign out
            </Button.Text>
          </Button>
        </XStack>
      </XStack>

      {tab === 'event' ? (
        <EventPage mode="host" />
      ) : (
        <ScrollView flex={1} backgroundColor={rally.ink}>
          {tab === 'guests' ? <Attendees /> : <Edit />}
        </ScrollView>
      )}
    </YStack>
  )
}
