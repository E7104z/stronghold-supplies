export type UserRole = 'admin' | 'contractor'

export interface AppUser {
  uid: string
  email: string
  name: string
  role: UserRole
  companyName: string
  phone: string
  createdAt: Date
}

export interface Contractor {
  id: string
  name: string
  companyName: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
  notes: string
  createdAt: Date
}

export interface InventoryItem {
  id: string
  name: string
  thickness: string
  wearLayer: number
  colorway: string
  costPerSqFt: number
  inStock: boolean
  notes: string
}

export interface LineItem {
  inventoryId: string
  description: string
  sqFt: number
  costPerSqFt: number
  sellPerSqFt: number
  total: number
}

export interface Quote {
  id: string
  contractorId: string
  contractorName: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'converted'
  lineItems: LineItem[]
  subtotal: number
  totalCost: number
  totalMargin: number
  notes: string
  createdAt: Date
  sentAt?: Date
}

export interface Order {
  id: string
  quoteId?: string
  contractorId: string
  contractorName: string
  status: 'pending' | 'confirmed' | 'picked_up' | 'delivered' | 'complete'
  lineItems: LineItem[]
  totalSqFt: number
  totalCost: number
  totalRevenue: number
  totalMargin: number
  pickupDate?: Date
  notes: string
  createdAt: Date
}

export interface Invoice {
  id: string
  orderId: string
  contractorId: string
  contractorName: string
  invoiceNumber: string
  status: 'unpaid' | 'paid' | 'overdue'
  lineItems: LineItem[]
  subtotal: number
  tax: number
  total: number
  dueDate: Date
  paidAt?: Date
  createdAt: Date
}
