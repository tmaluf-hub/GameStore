import { createContext, useState, useEffect } from 'react'

function loadCart() {
  try {
    const saved = localStorage.getItem("carrito")
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem("carrito", JSON.stringify(cart))
    } catch {
      // storage lleno // bloqueado
    }
  }, [cart])


  const addToCart = (videojuego) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === videojuego.id)
      if (existing) {
        return prev.map((item) =>
          item.id === videojuego.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      const { id, nombre_del_juego, precio } = videojuego
      return [...prev, { id, nombre_del_juego, precio, quantity: 1 }]
    })
  }


  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setCart([])

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id)

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)
      ))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0)


  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, removeFromCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}
