import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut,
  createUserWithEmailAndPassword, updatePassword, sendPasswordResetEmail,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { AppUser } from '../types'

export interface SignupData {
  name: string
  email: string
  password: string
  companyName: string
  phone: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

interface AuthContextType {
  user: AppUser | null
  firebaseUser: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<AppUser>) => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const snap = await getDoc(doc(db, 'users', fbUser.uid))
        if (snap.exists()) {
          setUser({ uid: fbUser.uid, ...snap.data() } as AppUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
  }, [])

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password).then(() => {})

  const signup = async (data: SignupData) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: data.email,
      name: data.name,
      role: 'contractor',
      companyName: data.companyName,
      phone: data.phone,
      address: data.address ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      zip: data.zip ?? '',
      createdAt: serverTimestamp(),
    })
  }

  const logout = () => signOut(auth)

  const updateProfile = async (data: Partial<AppUser>) => {
    if (!firebaseUser) throw new Error('Not signed in')
    const { uid: _uid, role: _role, email: _email, createdAt: _createdAt, ...allowed } = data
    void _uid; void _role; void _email; void _createdAt
    await updateDoc(doc(db, 'users', firebaseUser.uid), allowed as Record<string, unknown>)
    const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
    if (snap.exists()) setUser({ uid: firebaseUser.uid, ...snap.data() } as AppUser)
  }

  const changePassword = async (newPassword: string) => {
    if (!firebaseUser) throw new Error('Not signed in')
    await updatePassword(firebaseUser, newPassword)
  }

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email)

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, signup, logout, updateProfile, changePassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
