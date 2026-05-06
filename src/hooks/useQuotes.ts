import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc,
  doc, query, orderBy, serverTimestamp, where
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Quote, Order } from '../types'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    let q
    if (user.role === 'admin') {
      q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'))
    } else {
      q = query(
        collection(db, 'quotes'),
        where('contractorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
    }
    const unsub = onSnapshot(q, (snap) => {
      setQuotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Quote)))
      setLoading(false)
    })
    return unsub
  }, [user])

  const addQuote = async (data: Omit<Quote, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'quotes'), { ...data, createdAt: serverTimestamp() })
      toast.success('Quote created')
    } catch {
      toast.error('Failed to create quote')
    }
  }

  const updateQuote = async (id: string, data: Partial<Quote>) => {
    try {
      await updateDoc(doc(db, 'quotes', id), data)
      toast.success('Quote updated')
    } catch {
      toast.error('Failed to update quote')
    }
  }

  const convertToOrder = async (quote: Quote): Promise<string | null> => {
    try {
      const totalRevenue = quote.lineItems.reduce((s, li) => s + li.sellPerSqFt * li.sqFt, 0)
      const totalSqFt = quote.lineItems.reduce((s, li) => s + li.sqFt, 0)
      const orderData: Omit<Order, 'id'> = {
        quoteId: quote.id,
        contractorId: quote.contractorId,
        contractorName: quote.contractorName,
        status: 'pending',
        lineItems: quote.lineItems,
        totalSqFt,
        totalCost: quote.totalCost,
        totalRevenue,
        totalMargin: totalRevenue - quote.totalCost,
        notes: quote.notes,
        createdAt: new Date(),
      }
      const ref = await addDoc(collection(db, 'orders'), { ...orderData, createdAt: serverTimestamp() })
      await updateDoc(doc(db, 'quotes', quote.id), { status: 'converted' })
      toast.success('Quote converted to order')
      return ref.id
    } catch {
      toast.error('Failed to convert quote')
      return null
    }
  }

  return { quotes, loading, addQuote, updateQuote, convertToOrder }
}
