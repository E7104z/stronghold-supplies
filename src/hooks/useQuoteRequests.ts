import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, doc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { QuoteRequest } from '../types'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export function useQuoteRequests() {
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const q = user.role === 'admin'
      ? query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'quoteRequests'),
          where('contractorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
        )
    const unsub = onSnapshot(q, snap => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as QuoteRequest)))
      setLoading(false)
    })
    return unsub
  }, [user])

  const submitRequest = async (data: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => {
    try {
      await addDoc(collection(db, 'quoteRequests'), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp(),
      })
      toast.success('Quote request submitted')
    } catch {
      toast.error('Failed to submit request')
      throw new Error('failed')
    }
  }

  const updateRequest = async (id: string, data: Partial<QuoteRequest>) => {
    try {
      await updateDoc(doc(db, 'quoteRequests', id), data)
      toast.success('Updated')
    } catch {
      toast.error('Failed to update')
    }
  }

  return { requests, loading, submitRequest, updateRequest }
}
