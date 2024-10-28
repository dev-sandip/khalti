import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Home, AlertCircle } from "lucide-react"

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Extract parameters from the URL
  const purchaseOrderName = searchParams.get('purchase_order_name') || ''
  const amount = searchParams.get('amount') || ''
  const purchaseOrderId = searchParams.get('purchase_order_id') || ''
  const transactionId = searchParams.get('transaction_id') || ''
  const mobile = searchParams.get('mobile') || ''
  const status = searchParams.get('status') || ''

  useEffect(() => {
    if (status !== 'Completed') {
      setErrorMessage('Payment status is not completed. Please check your transaction.')
    }
  }, [status])

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )

  if (errorMessage) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <Button className="mt-4 w-full" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Your transaction has been completed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-lg">Order Details</h3>
            <DetailItem label="Product" value={decodeURIComponent(purchaseOrderName)} />
            <DetailItem label="Amount" value={`NPR ${parseInt(amount) / 100}`} />
            <DetailItem label="Order ID" value={purchaseOrderId} />
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2 text-lg">Payment Details</h3>
            <DetailItem label="Transaction ID" value={transactionId} />
            <DetailItem label="Payment Status" value={status} />
            <DetailItem label="Mobile" value={mobile} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}