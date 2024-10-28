import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import productsData from '@/data/products.json'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { fetchImageByTitle } from '@/hooks/fetchImage'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProductsWithImages = async () => {
      setLoading(true)
      const productsWithImages = await Promise.all(
        productsData.map(async (product) => {
          const imageUrl = await fetchImageByTitle(product.name).catch(() => '/placeholder.svg?height=200&width=200')
          return { ...product, image_url: imageUrl }
        })
      )
      setProducts(productsWithImages)
      setLoading(false)
    }

    loadProductsWithImages()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Explore Our Products
      </h1>
      <p className="text-center text-gray-600 mb-3">
        Click on the product to buy it now.
      </p>
      <p className="text-center text-gray-600 mb-6">
        Made with ❤️ by <a href="https://github.com/dev-sandip" className="text-purple-500">Sandip</a>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <AspectRatio ratio={4 / 3}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <AspectRatio ratio={4 / 3}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <CardHeader>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-lg">
                  Price: NPR {product.price / 100}
                </p>
              </CardContent>
              <CardFooter>
                <Link to={`/products/${product.id}`} className="w-full">
                  <Button className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}