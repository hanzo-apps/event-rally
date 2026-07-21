import { useIam } from '@hanzo/iam/react'
import { YStack, Spinner } from '@hanzo/gui'
import { rally } from './theme'
import { Callback } from './auth/callback'
import { EventPage } from './views/event'
import { Host } from './views/host'

/**
 * Top-level route + auth gate — no router dependency (one static SPA):
 *   /auth/callback  → finish the PKCE exchange, then land home
 *   signed out      → the public event page (hero + "Sign in to RSVP")
 *   signed in       → the host shell (RSVP · guest list · edit)
 *
 * The event page is public by design: the invite is the landing, and the RSVP /
 * management is what sign-in unlocks.
 */
export function App() {
  const { isAuthenticated, isLoading } = useIam()

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback')) {
    return <Callback />
  }
  if (isLoading) {
    return (
      <YStack flex={1} minHeight="100vh" alignItems="center" justifyContent="center" backgroundColor={rally.ink}>
        <Spinner size="large" color={rally.accent} />
      </YStack>
    )
  }
  return isAuthenticated ? <Host /> : <EventPage mode="public" />
}
