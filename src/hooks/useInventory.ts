import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { InventoryItem } from '../types'
import toast from 'react-hot-toast'

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('name'))
    const unsub = onSnapshot(q, (snap) => {
      setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem)))
      setLoading(false)
    })
    return unsub
  }, [])

  const addItem = async (data: Omit<InventoryItem, 'id'>) => {
    try {
      await addDoc(collection(db, 'inventory'), data)
      toast.success('Item added')
    } catch {
      toast.error('Failed to add item')
    }
  }

  const updateItem = async (id: string, data: Partial<InventoryItem>) => {
    try {
      await updateDoc(doc(db, 'inventory', id), data)
      toast.success('Item updated')
    } catch {
      toast.error('Failed to update item')
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inventory', id))
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete item')
    }
  }

  return { inventory, loading, addItem, updateItem, deleteItem }
}
