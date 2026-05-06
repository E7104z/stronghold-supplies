import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useContractors } from '../../hooks/useContractors'
import type { Contractor } from '../../types'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'

const empty: Omit<Contractor, 'id' | 'createdAt'> = {
  name: '', companyName: '', email: '', phone: '', address: '', status: 'active', notes: ''
}

export default function Contractors() {
  const { contractors, loading, addContractor, updateContractor, deleteContractor } = useContractors()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Contractor | null>(null)
  const [form, setForm] = useState(empty)

  const filtered = contractors.filter(c =>
    `${c.name} ${c.companyName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (c: Contractor) => { setEditing(c); setForm({ name: c.name, companyName: c.companyName, email: c.email, phone: c.phone, address: c.address, status: c.status, notes: c.notes }); setModal('edit') }

  const handleSave = async () => {
    if (modal === 'add') await addContractor(form)
    else if (modal === 'edit' && editing) await updateContractor(editing.id, form)
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this contractor?')) await deleteContractor(id)
  }

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-stronghold-black mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
      />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stronghold-black">Contractors</h1>
          <p className="text-stronghold-gray text-sm">{contractors.length} total</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Contractor</Button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stronghold-gray" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contractors..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
        />
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center text-stronghold-gray">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-stronghold-gray">No contractors found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Company</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Phone</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-stronghold-lightgray/50">
                  <td className="px-6 py-4 text-sm font-medium text-stronghold-black">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">{c.companyName}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">{c.phone}</td>
                  <td className="px-6 py-4">
                    <Badge label={c.status} variant={c.status === 'active' ? 'success' : 'default'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil size={14} /></Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Contractor' : 'Edit Contractor'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {field('Name', 'name')}
            {field('Company Name', 'companyName')}
            {field('Email', 'email', 'email')}
            {field('Phone', 'phone', 'tel')}
            {field('Address', 'address')}
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {field('Notes', 'notes')}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
