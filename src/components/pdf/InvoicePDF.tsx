import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Invoice } from '../../types'

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 },
  logo: { width: 80, height: 40, objectFit: 'contain' },
  companyInfo: { textAlign: 'right' },
  companyName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#C0392B', marginBottom: 4 },
  companyDetail: { fontSize: 9, color: '#6B6B6B' },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1A1A1A', marginBottom: 4 },
  invoiceNumber: { fontSize: 9, color: '#6B6B6B', marginBottom: 24 },
  metaRow: { flexDirection: 'row', gap: 40, marginBottom: 24 },
  section: { marginBottom: 8 },
  sectionLabel: { fontSize: 9, color: '#6B6B6B', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 },
  sectionValue: { fontSize: 11, color: '#1A1A1A' },
  divider: { borderBottom: 1, borderColor: '#E8E4DC', marginBottom: 16 },
  statusBadge: { padding: '4 10', borderRadius: 20, alignSelf: 'flex-start', marginBottom: 24 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1A1A1A', padding: '8 12', borderRadius: 4, marginBottom: 2 },
  tableHeaderText: { fontSize: 9, color: '#E8E4DC', fontFamily: 'Helvetica-Bold' },
  tableRow: { flexDirection: 'row', padding: '8 12', borderBottom: 1, borderColor: '#F2F0EC' },
  tableCell: { fontSize: 9, color: '#1A1A1A' },
  tableCellGray: { fontSize: 9, color: '#6B6B6B' },
  totalsSection: { marginTop: 16, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 6 },
  totalLabel: { fontSize: 10, color: '#6B6B6B' },
  totalValue: { fontSize: 10, color: '#1A1A1A' },
  grandTotal: { flexDirection: 'row', justifyContent: 'space-between', width: 200, borderTop: 1, borderColor: '#C0392B', paddingTop: 8, marginTop: 4 },
  grandTotalLabel: { fontSize: 12, color: '#1A1A1A', fontFamily: 'Helvetica-Bold' },
  grandTotalValue: { fontSize: 12, color: '#C0392B', fontFamily: 'Helvetica-Bold' },
  paymentBox: { marginTop: 32, padding: 16, backgroundColor: '#F2F0EC', borderRadius: 4, borderLeft: 3, borderColor: '#C0392B' },
  paymentTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1A1A1A', marginBottom: 6 },
  paymentDetail: { fontSize: 9, color: '#6B6B6B', marginBottom: 2 },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, textAlign: 'center', fontSize: 8, color: '#6B6B6B', borderTop: 1, borderColor: '#E8E4DC', paddingTop: 12 },
})

interface Props { invoice: Invoice }

function fmtDate(d: unknown) {
  if (!d) return '—'
  return new Date(d as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function InvoicePDF({ invoice }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Strong Hold Supplies</Text>
            <Text style={styles.companyDetail}>stronghold-supplies.web.app</Text>
          </View>
        </View>

        <Text style={styles.title}>Invoice</Text>
        <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>

        <View style={styles.metaRow}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Bill To</Text>
            <Text style={styles.sectionValue}>{invoice.contractorName}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Invoice Date</Text>
            <Text style={styles.sectionValue}>{fmtDate(invoice.createdAt)}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Due Date</Text>
            <Text style={styles.sectionValue}>{fmtDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Status</Text>
            <Text style={[styles.sectionValue, { color: invoice.status === 'paid' ? '#16a34a' : invoice.status === 'overdue' ? '#C0392B' : '#1A1A1A' }]}>
              {invoice.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Line Items */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>Description</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Sq Ft</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Price/sqft</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
        </View>

        {invoice.lineItems.map((li, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>{li.description}</Text>
            <Text style={[styles.tableCellGray, { flex: 1, textAlign: 'right' }]}>{li.sqFt.toLocaleString()}</Text>
            <Text style={[styles.tableCellGray, { flex: 1, textAlign: 'right' }]}>${li.sellPerSqFt.toFixed(2)}</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>${li.total.toFixed(2)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${invoice.subtotal.toFixed(2)}</Text>
          </View>
          {invoice.tax > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>${invoice.tax.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total Due</Text>
            <Text style={styles.grandTotalValue}>${invoice.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>Payment Information</Text>
          <Text style={styles.paymentDetail}>Please reference invoice number {invoice.invoiceNumber} with your payment.</Text>
          <Text style={styles.paymentDetail}>Due by: {fmtDate(invoice.dueDate)}</Text>
        </View>

        <Text style={styles.footer}>
          Strong Hold Supplies · Thank you for your business.
        </Text>
      </Page>
    </Document>
  )
}
