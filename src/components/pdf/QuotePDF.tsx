import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Quote } from '../../types'
import { toDate } from '../../lib/dateUtils'

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 },
  logo: { width: 80, height: 40, objectFit: 'contain' },
  companyInfo: { textAlign: 'right' },
  companyName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#C0392B', marginBottom: 4 },
  companyDetail: { fontSize: 9, color: '#6B6B6B' },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1A1A1A', marginBottom: 4 },
  quoteId: { fontSize: 9, color: '#6B6B6B', marginBottom: 24 },
  section: { marginBottom: 16 },
  sectionLabel: { fontSize: 9, color: '#6B6B6B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  sectionValue: { fontSize: 11, color: '#1A1A1A' },
  divider: { borderBottom: 1, borderColor: '#E8E4DC', marginBottom: 16 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1A1A1A', padding: '8 12', borderRadius: 4, marginBottom: 2 },
  tableHeaderText: { fontSize: 9, color: '#E8E4DC', fontFamily: 'Helvetica-Bold' },
  tableRow: { flexDirection: 'row', padding: '8 12', borderBottom: 1, borderColor: '#F2F0EC' },
  tableCell: { fontSize: 9, color: '#1A1A1A' },
  tableCellGray: { fontSize: 9, color: '#6B6B6B' },
  totalsSection: { marginTop: 16, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 4 },
  totalLabel: { fontSize: 10, color: '#6B6B6B' },
  totalValue: { fontSize: 10, color: '#1A1A1A', fontFamily: 'Helvetica-Bold' },
  grandTotal: { flexDirection: 'row', justifyContent: 'space-between', width: 200, borderTop: 1, borderColor: '#C0392B', paddingTop: 8, marginTop: 4 },
  grandTotalLabel: { fontSize: 12, color: '#1A1A1A', fontFamily: 'Helvetica-Bold' },
  grandTotalValue: { fontSize: 12, color: '#C0392B', fontFamily: 'Helvetica-Bold' },
  notes: { marginTop: 24, padding: 12, backgroundColor: '#F2F0EC', borderRadius: 4 },
  notesLabel: { fontSize: 9, color: '#6B6B6B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  notesText: { fontSize: 10, color: '#1A1A1A' },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, textAlign: 'center', fontSize: 8, color: '#6B6B6B', borderTop: 1, borderColor: '#E8E4DC', paddingTop: 12 },
})

interface Props { quote: Quote }

export default function QuotePDF({ quote }: Props) {
  const date = toDate(quote.createdAt)?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) ?? ''

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Image src="/logo.png" style={styles.logo} />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Strong Hold Supplies</Text>
            <Text style={styles.companyDetail}>stronghold-supplies.web.app</Text>
          </View>
        </View>

        <Text style={styles.title}>Quote</Text>
        <Text style={styles.quoteId}>#{quote.id.slice(0, 8).toUpperCase()} · {date}</Text>

        <View style={styles.divider} />

        {/* Contractor */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Prepared For</Text>
          <Text style={styles.sectionValue}>{quote.contractorName}</Text>
        </View>

        <View style={styles.divider} />

        {/* Line Items */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>Description</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Sq Ft</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Price/sqft</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
        </View>

        {quote.lineItems.map((li, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>{li.description}</Text>
            <Text style={[styles.tableCellGray, { flex: 1, textAlign: 'right' }]}>{li.sqFt.toLocaleString()}</Text>
            <Text style={[styles.tableCellGray, { flex: 1, textAlign: 'right' }]}>${li.sellPerSqFt.toFixed(2)}</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>${li.total.toFixed(2)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>${quote.subtotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{quote.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Strong Hold Supplies · This quote is valid for 30 days from the date of issue.
        </Text>
      </Page>
    </Document>
  )
}
