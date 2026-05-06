import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, updateDoc,
  doc, query, orderBy, where, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Invoice } from '../types'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    let q
    if (user.role === 'admin') {
      q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'))
    } else {
      q = query(
        collection(db, 'invoices'),
        where('contractorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
    }
    const unsub = onSnapshot(q, (snap) => {
      setInvoices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)))
      setLoading(false)
    })
    return unsub
  }, [user])

  const markPaid = async (id: string) => {
    try {
      await updateDoc(doc(db, 'invoices', id), {
        status: 'paid',
        paidAt: serverTimestamp()
      })
      toast.success('Invoice marked as paid')
    } catch {
      toast.error('Failed to update invoice')
    }
  }

  const markOverdue = async (id: string) => {
    try {
      await updateDoc(doc(db, 'invoices', id), { status: 'overdue' })
      toast.success('Invoice marked as overdue')
    } catch {
      toast.error('Failed to update invoice')
    }
  }

  return { invoices, loading, markPaid, markOverdue }
}
