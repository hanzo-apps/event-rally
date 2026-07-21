import { useEffect, useState } from 'react'
import { useMutation } from '@hanzo/base/react'
import { YStack, XStack, Text, Paragraph } from '@hanzo/gui'
import { rally } from '../theme'
import { useEvent, sampleEvent } from '../lib/event'
import { Field, Cta } from './ui'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Split an ISO-ish string into the date + time the two inputs edit. */
function splitDateTime(iso: string) {
  const dt = new Date(iso)
  if (Number.isNaN(dt.getTime())) return { date: '', time: '' }
  return {
    date: `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`,
    time: `${pad(dt.getHours())}:${pad(dt.getMinutes())}`,
  }
}

/** Host view: edit the one event. Creates the row on first save, updates after. */
export function Edit({ onSaved }: { onSaved?: () => void }) {
  const { record, refetch } = useEvent()
  const create = useMutation('event', 'create')
  const update = useMutation('event', 'update')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const src = record ?? sampleEvent
    const dt = splitDateTime(src.starts_at)
    setTitle(src.title)
    setDescription(src.description)
    setDate(dt.date)
    setTime(dt.time)
    setLocation(src.location)
    setCapacity(String(src.capacity))
  }, [record?.id])

  const busy = create.isLoading || update.isLoading
  const err = create.error || update.error

  async function save() {
    if (!title.trim() || busy) return
    const starts_at = date ? `${date}T${time || '00:00'}:00` : ''
    const payload = {
      title: title.trim(),
      description: description.trim(),
      starts_at,
      location: location.trim(),
      capacity: Number.parseInt(capacity, 10) || 0,
    }
    if (record) {
      await update.mutate({ id: record.id, ...payload })
    } else {
      await create.mutate(payload)
    }
    await refetch()
    setSaved(true)
    onSaved?.()
    setTimeout(() => setSaved(false), 2400)
  }

  return (
    <YStack gap="$4" width="100%" maxWidth={560} alignSelf="center" paddingVertical={28} paddingHorizontal={20}>
      <YStack gap="$2">
        <Text fontSize={13} fontWeight="900" letterSpacing={2} color={rally.accent}>
          EVENT DETAILS
        </Text>
        <Text fontSize={30} fontWeight="900" letterSpacing={-0.5} color={rally.cream}>
          Edit your event
        </Text>
      </YStack>

      <YStack backgroundColor={rally.cream} borderRadius={26} padding={24} gap="$4">
        <Field label="Title" value={title} onChangeText={setTitle} placeholder="Midnight Rooftop Rally" />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Tell guests what to expect…"
          multiline
        />
        <XStack gap="$3">
          <YStack flex={1}>
            <Field label="Date" value={date} onChangeText={setDate} placeholder="2026-08-15" />
          </YStack>
          <YStack width={140}>
            <Field label="Time" value={time} onChangeText={setTime} placeholder="20:00" />
          </YStack>
        </XStack>
        <Field label="Location" value={location} onChangeText={setLocation} placeholder="The Ardent · 55 Mercer St" />
        <Field
          label="Capacity"
          value={capacity}
          onChangeText={setCapacity}
          placeholder="120"
          inputMode="numeric"
        />

        {err ? <Paragraph color={rally.ember}>{err.message}</Paragraph> : null}

        <Cta
          label={busy ? 'Saving…' : saved ? 'Saved ✓' : record ? 'Save changes' : 'Publish event'}
          background={saved ? rally.good : rally.accent}
          height={56}
          fontSize={17}
          disabled={!title.trim() || busy}
          onPress={save}
        />
      </YStack>
    </YStack>
  )
}
