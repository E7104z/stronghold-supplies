import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useInventory } from '../../hooks/useInventory'
import type { InventoryItem } from '../../types'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'

const empty: Omit<InventoryItem, 'id'> = {
  name: '', thickness: '', wearLayer: 0, colorway: '', costPerSqFt: 0, inStock: true, notes: ''
}

export default function Inventory() {
  const { inventory, loading, addItem, updateItem, deleteItem } = useInventory()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [form, setForm] = useState<Omit<InventoryItem, 'id'>>(empty)

  const filtered = inventory.filter(i =>
    `${i.name} ${i.colorway} ${i.thickness}`.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (item: InventoryItem) => {
    setEditing(item)
    setForm({ name: item.name, thickness: item.thickness, wearLayer: item.wearLayer, colorway: item.colorway, costPerSqFt: item.costPerSqFt, inStock: item.inStock, notes: item.notes })
    setModal('edit')
  }

  const handleSave = async () => {
    if (modal === 'add') await addItem(form)
    else if (modal === 'edit' && editing) await updateItem(editing.id, form)
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) await deleteItem(id)
  }

  const textField = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-stronghold-black mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string | number}
        onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
      />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stronghold-black">Inventory</h1>
          <p className="text-stronghold-gray text-sm">{inventory.length} products</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Item</Button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stronghold-gray" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search inventory..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
        />
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center text-stronghold-gray">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-stronghold-gray">No items found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Product</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Thickness</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Wear Layer</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Colorway</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Cost/sqft</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Stock</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-stronghold-lightgray/50">
                  <td className="px-6 py-4 text-sm font-medium text-stronghold-black">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">{item.thickness}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">{item.wearLayer}mil</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">{item.colorway}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">${item.costPerSqFt.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <Badge label={item.inStock ? 'In Stock' : 'Out of Stock'} variant={item.inStock ? 'success' : 'danger'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil size={14} /></Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Item' : 'Edit Item'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {textField('Product Name', 'name')}
            {textField('Thickness (e.g. 12mm)', 'thickness')}
            {textField('Wear Layer (mil)', 'wearLayer', 'number')}
            {textField('Colorway', 'colorway')}
            {textField('Cost Per Sq Ft ($)', 'costPerSqFt', 'number')}
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Stock Status</label>
              <select
                value={form.inStock ? 'true' : 'false'}
                onChange={e => setForm(f => ({ ...f, inStock: e.target.value === 'true' }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
              >
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
            {textField('Notes', 'notes')}
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
