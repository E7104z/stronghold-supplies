import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Contractor } from '../types'
import toast from 'react-hot-toast'

export function useContractors() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'contractors'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setContractors(snap.docs.map(d => ({ id: d.id, ...d.data() } as Contractor)))
      setLoading(false)
    })
    return unsub
  }, [])

  const addContractor = async (data: Omit<Contractor, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'contractors'), { ...data, createdAt: serverTimestamp() })
      toast.success('Contractor added')
    } catch {
      toast.error('Failed to add contractor')
    }
  }

  const updateContractor = async (id: string, data: Partial<Contractor>) => {
    try {
      await updateDoc(doc(db, 'contractors', id), data)
      toast.success('Contractor updated')
    } catch {
      toast.error('Failed to update contractor')
    }
  }

  const deleteContractor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contractors', id))
      toast.success('Contractor deleted')
    } catch {
      toast.error('Failed to delete contractor')
    }
  }

  return { contractors, loading, addContractor, updateContractor, deleteContractor }
}
