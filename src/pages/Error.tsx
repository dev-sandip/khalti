import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Home, RefreshCw, Mail } from "lucide-react"

interface ErrorState {
  error: string
  details?: string
  errorCode?: string
  suggestions: string[]
  canRetry?: boolean
  redirectPath?: string
}

const defaultSuggestions = [
  'Check your internet connection and try again',
  'Ensure you have sufficient funds in your account',
  'Contact your bank if the issue persists',
  'Try using a different payment method'
]

export default function ErrorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [errorState, setErrorState] = useState<ErrorState>({
    error: 'An unexpected error occurred',
    suggestions: defaultSuggestions
  })
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const state = location.state as ErrorState | null

    if (state?.error) {
      const suggestions = state.suggestions || defaultSuggestions
      setErrorState({ ...state, suggestions })

      if (state.redirectPath) {
        setTimeLeft(5)
      }
    }
  }, [location])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeLeft === 0 && errorState.redirectPath) {
      navigate(errorState.redirectPath)
    }
  }, [timeLeft, navigate, errorState.redirectPath])

  const handleRetry = () => {
    if (errorState.canRetry) {
      navigate(-1)
    }
  }

  const handleBackHome = () => {
    navigate('/')
  }

  return (
    <div className="container max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-destructive/20 p-3 w-16 h-16 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">{errorState.error}</CardTitle>
          {errorState.details && (
            <CardDescription className="mt-2">{errorState.details}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {errorState.errorCode && (
            <p className="text-sm text-muted-foreground text-center">
              Error Code: {errorState.errorCode}
            </p>
          )}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-foreground">
              Suggested Actions:
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {errorState.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {errorState.canRetry && (
            <Button className="w-full" onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={handleBackHome}>
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          {timeLeft > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Redirecting in {timeLeft} seconds...
            </p>
          )}
        </CardFooter>
      </Card>
      <Alert variant="default" className="mt-8">
        <Mail className="h-4 w-4" />
        <AlertTitle>Need help?</AlertTitle>
        <AlertDescription>
          Contact our support at{' '}
          <a
            href="mailto:support@example.com"
            className="text-primary hover:underline"
          >
            support@example.com
          </a>
        </AlertDescription>
      </Alert>
    </div>
  )
}