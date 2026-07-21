import type { ReactNode } from 'react'
import { YStack, XStack, Text, Input, TextArea, Button } from '@hanzo/gui'
import { rally } from '../theme'

/** A labeled text field styled for the cream ticket / host surfaces. */
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  inputMode,
  multiline,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  inputMode?: 'text' | 'email' | 'numeric'
  multiline?: boolean
}) {
  const shared = {
    value,
    onChangeText,
    placeholder,
    backgroundColor: '#FFFFFF',
    borderColor: rally.creamEdge,
    borderWidth: 1,
    borderRadius: 14,
    color: rally.onCream,
    placeholderTextColor: 'gray',
    fontSize: 16,
    focusStyle: { borderColor: rally.accent },
  } as const

  return (
    <YStack gap="$2" width="100%">
      <Text
        fontSize={12}
        fontWeight="800"
        letterSpacing={1.5}
        textTransform="uppercase"
        color={rally.onCreamDim}
      >
        {label}
      </Text>
      {multiline ? (
        <TextArea {...shared} minHeight={92} paddingTop={12} />
      ) : (
        <Input {...shared} height={50} inputMode={inputMode} />
      )}
    </YStack>
  )
}

/** A small rounded status badge. */
export function Pill({
  children,
  background,
  color,
}: {
  children: ReactNode
  background: string
  color: string
}) {
  return (
    <XStack
      backgroundColor={background}
      paddingHorizontal={11}
      paddingVertical={5}
      borderRadius={999}
      alignItems="center"
    >
      <Text fontSize={12} fontWeight="800" letterSpacing={0.6} color={color}>
        {children}
      </Text>
    </XStack>
  )
}

/**
 * The one solid pill CTA — every big call-to-action routes through here so the
 * accent, press feedback, and disabled state read the same everywhere.
 * Button's frame is a Stack, so the label is styled on `Button.Text`.
 */
export function Cta({
  label,
  onPress,
  disabled,
  background = rally.accent,
  color = rally.onAccent,
  pressColor = rally.accentDeep,
  height = 58,
  fontSize = 18,
}: {
  label: string
  onPress: () => void
  disabled?: boolean
  background?: string
  color?: string
  pressColor?: string
  height?: number
  fontSize?: number
}) {
  return (
    <Button
      height={height}
      borderRadius={16}
      backgroundColor={background}
      disabled={disabled}
      opacity={disabled ? 0.55 : 1}
      pressStyle={{ scale: 0.98, backgroundColor: pressColor }}
      onPress={onPress}
    >
      <Button.Text color={color} fontSize={fontSize} fontWeight="900" letterSpacing={0.3}>
        {label}
      </Button.Text>
    </Button>
  )
}

/** A −/count/+ stepper for the guest headcount. */
export function Stepper({
  value,
  onChange,
  tint = rally.accent,
}: {
  value: number
  onChange: (v: number) => void
  tint?: string
}) {
  return (
    <XStack alignItems="center" gap="$3">
      <Button
        circular
        size="$4"
        backgroundColor="#FFFFFF"
        borderColor={rally.creamEdge}
        borderWidth={1}
        disabled={value <= 0}
        opacity={value <= 0 ? 0.4 : 1}
        onPress={() => onChange(Math.max(0, value - 1))}
      >
        <Button.Text color={tint} fontSize={22} fontWeight="900">
          −
        </Button.Text>
      </Button>
      <Text fontSize={22} fontWeight="900" color={rally.onCream} minWidth={28} textAlign="center">
        {value}
      </Text>
      <Button circular size="$4" backgroundColor={tint} onPress={() => onChange(value + 1)}>
        <Button.Text color={rally.onAccent} fontSize={22} fontWeight="900">
          +
        </Button.Text>
      </Button>
    </XStack>
  )
}
