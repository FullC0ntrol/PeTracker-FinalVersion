import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import PageHeader from '../../components/layout/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'

import { useAuth } from '../../hooks/useAuth.js'

export default function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(email, pin)
      navigate(location.state?.from ?? '/panel', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
      setIsSubmitting(false)
    }
  }
  return (
    <div className="mx-auto max-w-sm">
      <PageHeader title="Logowanie" description="Wpisz adres e-mail i swój 6-cyfrowy PIN." />
      <Card as="form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Adres e-mail"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="PIN"
          type="password"
          name="pin"
          inputMode="numeric"
          autoComplete="current-password"
          maxLength={6}
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          error={error}
          hint="Nie pamiętasz PIN-u? Skontaktuj się z administratorem."
        />
        <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Loguję…' : 'Zaloguj się'}
        </Button>
        <p className="text-center text-sm text-ink-muted">
          Nie masz konta?{' '}
          <Link
            to="/rejestracja"
            state={location.state}
            className="font-semibold text-pine underline-offset-4 hover:underline"
          >
            Załóż je
          </Link>
        </p>
      </Card>
    </div>
  )
}
