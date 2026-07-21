import { useState } from 'react'
import { useMutation } from '@hanzo/base/react'
import { YStack, XStack, Text, Button, Paragraph } from '@hanzo/gui'
import { rally } from '../theme'
import type { RsvpStatus } from '../lib/rsvp'
import { Field, Stepper, Cta } from './ui'

/**
 * The interactive RSVP — writes a row to the `rsvps` collection carrying the
 * signed-in user's IAM token. Yes captures a party size; no is one tap. On
 * success it flips to a confirmation and lets you edit the reply.
 */
export function RsvpForm({ onSent }: { onSent?: () => void }) {
  const create = useMutation('rsvps', 'create')
  const [status, setStatus] = useState<RsvpStatus | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [guests, setGuests] = useState(0)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState<RsvpStatus | null>(null)

  async function send() {
    if (!status || !name.trim() || create.isLoading) return
    await create.mutate({
      name: name.trim(),
      email: email.trim(),
      status,
      guests: status === 'yes' ? guests : 0,
      note: note.trim(),
    })
    setSent(status)
    onSent?.()
  }

  if (sent) {
    const heads = sent === 'yes' ? 1 + guests : 0
    return (
      <YStack gap="$3" alignItems="center" paddingVertical={6}>
        <Text fontSize={40}>{sent === 'yes' ? '🎉' : '💌'}</Text>
        <Text fontSize={22} fontWeight="900" color={rally.onCream} textAlign="center">
          {sent === 'yes' ? "You're on the list!" : 'Thanks for letting us know'}
        </Text>
        <Paragraph color={rally.onCreamDim} textAlign="center">
          {sent === 'yes'
            ? `${heads} ${heads === 1 ? 'spot' : 'spots'} saved under ${name}. See you there.`
            : `We'll miss you, ${name}. Maybe next time.`}
        </Paragraph>
        <Button
          chromeless
          onPress={() => {
            setSent(null)
            setStatus(null)
          }}
        >
          <Button.Text color={rally.accentDeep} fontWeight="800">
            Change my reply
          </Button.Text>
        </Button>
      </YStack>
    )
  }

  const yesActive = status === 'yes'
  const noActive = status === 'no'

  return (
    <YStack gap="$4">
      <XStack gap="$3">
        <Button
          flex={1}
          height={54}
          borderRadius={14}
          backgroundColor={yesActive ? rally.accent : '#FFFFFF'}
          borderColor={yesActive ? rally.accent : rally.creamEdge}
          borderWidth={1}
          pressStyle={{ scale: 0.97 }}
          onPress={() => setStatus('yes')}
        >
          <Button.Text color={yesActive ? rally.onAccent : rally.onCream} fontWeight="900" fontSize={16}>
            Going
          </Button.Text>
        </Button>
        <Button
          flex={1}
          height={54}
          borderRadius={14}
          backgroundColor={noActive ? rally.onCream : '#FFFFFF'}
          borderColor={noActive ? rally.onCream : rally.creamEdge}
          borderWidth={1}
          pressStyle={{ scale: 0.97 }}
          onPress={() => setStatus('no')}
        >
          <Button.Text color={noActive ? rally.cream : rally.onCreamDim} fontWeight="900" fontSize={16}>
            Can't make it
          </Button.Text>
        </Button>
      </XStack>

      {status ? (
        <YStack gap="$4">
          <Field label="Your name" value={name} onChangeText={setName} placeholder="Alex Rivera" />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="alex@email.com"
            inputMode="email"
          />

          {status === 'yes' ? (
            <XStack alignItems="center" justifyContent="space-between">
              <YStack>
                <Text
                  fontSize={12}
                  fontWeight="800"
                  letterSpacing={1.5}
                  textTransform="uppercase"
                  color={rally.onCreamDim}
                >
                  Bringing guests?
                </Text>
                <Text fontSize={13} color={rally.onCreamDim}>
                  {guests === 0 ? 'Just me' : `+${guests} with me`}
                </Text>
              </YStack>
              <Stepper value={guests} onChange={setGuests} />
            </XStack>
          ) : null}

          <Field
            label="Note to the host (optional)"
            value={note}
            onChangeText={setNote}
            placeholder={status === 'yes' ? "Can't wait!" : 'Sorry to miss it…'}
            multiline
          />

          {create.error ? <Paragraph color={rally.ember}>{create.error.message}</Paragraph> : null}

          <Cta
            label={create.isLoading ? 'Sending…' : status === 'yes' ? 'Count me in' : 'Send reply'}
            disabled={!name.trim() || create.isLoading}
            onPress={send}
          />
        </YStack>
      ) : null}
    </YStack>
  )
}
