import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, doc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { SupportMessage } from '../types'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export function useSupport() {
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const q = user.role === 'admin'
      ? query(collection(db, 'supportMessages'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'supportMessages'),
          where('contractorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
        )
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as SupportMessage)))
      setLoading(false)
    })
    return unsub
  }, [user])

  const sendMessage = async (data: Omit<SupportMessage, 'id' | 'createdAt' | 'status'>) => {
    try {
      await addDoc(collection(db, 'supportMessages'), {
        ...data,
        status: 'open',
        createdAt: serverTimestamp(),
      })
      toast.success('Message sent — we will respond shortly')
    } catch {
      toast.error('Failed to send')
      throw new Error('failed')
    }
  }

  const updateStatus = async (id: string, status: SupportMessage['status']) => {
    try {
      await updateDoc(doc(db, 'supportMessages', id), { status })
    } catch {
      toast.error('Failed')
    }
  }

  return { messages, loading, sendMessage, updateStatus }
}
