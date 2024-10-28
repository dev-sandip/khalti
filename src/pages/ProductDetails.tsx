import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import productsData from '@/data/products.json'
import { useKhalti } from '@/hooks/useKhalti'
import { PaymentRequest } from '@/types/khalti'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ShoppingCart } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchImageByTitle } from '@/hooks/fetchImage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Product } from './ProductPage'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  const { initiate, initiationError, isLoading } = useKhalti({
    onSuccess: (response) => {
      navigate(`/success`, { state: { product, response } })
    },
    onError: (error) => {
      console.error('Payment error:', error.message)
    },
  })

  useEffect(() => {
    const foundProduct = productsData.find((p) => p.id === id)
    if (foundProduct) {
      setProduct(foundProduct)
      fetchImageByTitle(foundProduct.name).then((imageUrl) => setImage(imageUrl))
    }
  }, [id])

  const handlePayment = () => {
    if (product) {
      const paymentRequest: PaymentRequest = {
        amount: product.price,
        purchase_order_id: `order-${product.id}`,
        purchase_order_name: product.name,
        customer_info: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        return_url: "http://localhost:3000/success",
        website_url: "http://yourwebsite.com",
      }
      initiate(paymentRequest)
      setIsDialogOpen(false)
    }
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <img
              src={image || product.image_url}
              alt={product.name}
              className="object-cover rounded-md"
            />
          </div>
          <p className="font-bold text-lg">Price: NPR {product.price / 100}</p>
        </CardContent>
        <CardFooter>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Pay with Khalti
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Customer Details</DialogTitle>
                <DialogDescription>
                  Please provide your information to proceed with the payment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handlePayment} disabled={isLoading || !customerName || !customerEmail || !customerPhone}>
                  {isLoading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      {initiationError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{initiationError.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}