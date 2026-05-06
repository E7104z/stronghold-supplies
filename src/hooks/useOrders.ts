import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc,
  doc, query, orderBy, serverTimestamp, where,
  runTransaction, getDoc
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Order, Invoice } from '../types'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

async function generateInvoiceNumber(): Promise<string> {
  const metaRef = doc(db, 'meta', 'invoiceCounter')
  let num = 1
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(metaRef)
    if (snap.exists()) {
      num = (snap.data().count as number) + 1
    }
    tx.set(metaRef, { count: num })
  })
  const year = new Date().getFullYear()
  return `SHS-${year}-${String(num).padStart(3, '0')}`
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    let q
    if (user.role === 'admin') {
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    } else {
      q = query(
        collection(db, 'orders'),
        where('contractorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
    }
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
      setLoading(false)
    })
    return unsub
  }, [user])

  const updateOrder = async (id: string, data: Partial<Order>) => {
    try {
      await updateDoc(doc(db, 'orders', id), data)

      // Auto-generate invoice when order is marked complete
      if (data.status === 'complete') {
        const orderSnap = await getDoc(doc(db, 'orders', id))
        if (orderSnap.exists()) {
          const order = { id: orderSnap.id, ...orderSnap.data() } as Order
          const invoiceNumber = await generateInvoiceNumber()
          const dueDate = new Date()
          dueDate.setDate(dueDate.getDate() + 30)

          const invoiceData: Omit<Invoice, 'id'> = {
            orderId: order.id,
            contractorId: order.contractorId,
            contractorName: order.contractorName,
            invoiceNumber,
            status: 'unpaid',
            lineItems: order.lineItems,
            subtotal: order.totalRevenue,
            tax: 0,
            total: order.totalRevenue,
            dueDate,
            createdAt: new Date(),
          }
          await addDoc(collection(db, 'invoices'), { ...invoiceData, createdAt: serverTimestamp() })
          toast.success(`Invoice ${invoiceNumber} generated`)
        }
      } else {
        toast.success('Order updated')
      }
    } catch {
      toast.error('Failed to update order')
    }
  }

  return { orders, loading, updateOrder }
}
