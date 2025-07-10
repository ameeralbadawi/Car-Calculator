import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.2
  },
  section: {
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  label: {
    fontWeight: 'bold'
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid'
  },
  table: {
    display: 'flex',
    width: '100%',
    marginBottom: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    paddingVertical: 2
  },
  tableHeader: {
    fontWeight: 'bold'
  },
  col25: {
    width: '33.3%'
  },
  col15: {
    width: '15%'
  },
  notes: {
    marginTop: 4,
    fontSize: 10,
    color: '#555'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    marginTop: 2
  },
  bold: {
    fontWeight: 'bold'
  }
});

const InvoicePDF = ({ formData }) => {
  const car = formData.Car;

  const {
    CarDetails,
    EstimateDetails,
    PurchaseDetails,
    TransportDetails,
    PartsDetails,
    MechanicDetails,
    BodyshopDetails,
    MiscellaniousDetails,
    saleDetails,
    InvoiceDetails
  } = car;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{`${CarDetails.year || ''} ${CarDetails.make || ''} ${CarDetails.model || ''}`}</Text>
          <View style={styles.row}>
            {CarDetails.vin && <Text>VIN: {CarDetails.vin}</Text>}
            {PurchaseDetails.mileage && <Text>Mileage: {PurchaseDetails.mileage}</Text>}
            {PurchaseDetails.color && <Text>Color: {PurchaseDetails.color}</Text>}
            {PurchaseDetails.stockNumber && <Text>Stock#: {PurchaseDetails.stockNumber}</Text>}
          </View>
          <Text style={styles.sectionHeader}>Estimate Details</Text>
          <View style={styles.row}>
            {EstimateDetails.mmr && <Text>MMR: ${Number(EstimateDetails.mmr).toFixed(2)}</Text>}
            {EstimateDetails.profit && <Text>Profit: ${Number(EstimateDetails.profit).toFixed(2)}</Text>}
            {EstimateDetails.transport && <Text>Transport: ${Number(EstimateDetails.transport).toFixed(2)}</Text>}
            {EstimateDetails.carfaxStatus && <Text>Carfax: {EstimateDetails.carfaxStatus}</Text>}
          </View>
          <View style={styles.row}>
            {EstimateDetails.repair && <Text>Repair: ${Number(EstimateDetails.repair).toFixed(2)}</Text>}
            {EstimateDetails.fees && <Text>Fees: ${Number(EstimateDetails.fees).toFixed(2)}</Text>}
            {EstimateDetails.maxBid && <Text>Max Bid: ${Number(EstimateDetails.maxBid).toFixed(2)}</Text>}
            {EstimateDetails.autocheckStatus && <Text>Autocheck: {EstimateDetails.autocheckStatus}</Text>}
          </View>
        </View>

        {/* Purchase Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Purchase Details</Text>
          <View style={styles.row}>
            {PurchaseDetails.purchaseDate && <Text>Purchase Date: {new Date(PurchaseDetails.purchaseDate).toLocaleDateString()}</Text>}
            {PurchaseDetails.purchaseFrom && <Text>From: {PurchaseDetails.purchaseFrom}</Text>}
            {PurchaseDetails.purchaseLocation && <Text>Location: {PurchaseDetails.purchaseLocation}</Text>}
          </View>
          <View style={styles.row}>
            {PurchaseDetails.winningBid && <Text>Winning Bid: ${Number(PurchaseDetails.winningBid).toFixed(2)}</Text>}
            {PurchaseDetails.amountPaid && <Text>Amount Paid: ${Number(PurchaseDetails.amountPaid).toFixed(2)}</Text>}
            {PurchaseDetails.buyerName && <Text>Buyer Name: {PurchaseDetails.buyerName}</Text>}
          </View>
          {PurchaseDetails.purchaseNotes && <Text style={styles.notes}>Notes: {PurchaseDetails.purchaseNotes}</Text>}
        </View>

        {/* Transport Section */}
        {(
          TransportDetails.transporterName ||
          TransportDetails.transporterPhone ||
          TransportDetails.cost > 0 ||
          TransportDetails.pickupDate ||
          TransportDetails.deliveryDate ||
          TransportDetails.transporterNotes
        ) && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Transport Details</Text>

              <View style={styles.row}>
                {TransportDetails.transporterName && (
                  <Text>Transporter: {TransportDetails.transporterName}</Text>
                )}
                {TransportDetails.transporterPhone && (
                  <Text>Phone: {TransportDetails.transporterPhone}</Text>
                )}
                {TransportDetails.cost > 0 && (
                  <Text>Cost: ${Number(TransportDetails.cost).toFixed(2)}</Text>
                )}
              </View>

              <View style={styles.row}>
                {TransportDetails.pickupDate && (
                  <Text>Pickup: {new Date(TransportDetails.pickupDate).toLocaleDateString()}</Text>
                )}
                {TransportDetails.deliveryDate && (
                  <Text>Delivery: {new Date(TransportDetails.deliveryDate).toLocaleDateString()}</Text>
                )}
              </View>

              {TransportDetails.transporterNotes && (
                <Text style={styles.notes}>Notes: {TransportDetails.transporterNotes}</Text>
              )}
            </View>
          )}


        {/* Parts Section */}

        {PartsDetails.parts?.some(
          (p) =>
            (p.part && p.part.trim() !== '') ||
            (p.purchasedFrom && p.purchasedFrom.trim() !== '') ||
            (parseFloat(p.amount) || 0) > 0
        ) && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>
                Parts Details (Total: ${Number(PartsDetails.partsTotal).toFixed(2)})
              </Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.col25}>Part</Text>
                  <Text style={styles.col25}>From</Text>
                  <Text style={styles.col15}>Amount</Text>
                </View>
                {PartsDetails.parts.map((p, i) => {
                  const showRow =
                    (p.part && p.part.trim() !== '') ||
                    (p.purchasedFrom && p.purchasedFrom.trim() !== '') ||
                    (parseFloat(p.amount) || 0) > 0;

                  return (
                    showRow && (
                      <View key={i} style={styles.tableRow}>
                        <Text style={styles.col25}>{p.part}</Text>
                        <Text style={styles.col25}>{p.purchasedFrom}</Text>
                        <Text style={styles.col15}>${Number(p.amount).toFixed(2)}</Text>
                      </View>
                    )
                  );
                })}
              </View>
              {PartsDetails.partsNotes && (
                <Text style={styles.notes}>Notes: {PartsDetails.partsNotes}</Text>
              )}
            </View>
          )}


        {/* Mechanic Section */}
        {/* Mechanic Section */}
        {MechanicDetails.mechanicServices?.some(
          (m) =>
            (m.shop && m.shop.trim() !== '') ||
            (m.service && m.service.trim() !== '') ||
            (parseFloat(m.amount) || 0) > 0
        ) && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>
                Mechanic Details (Total: ${Number(MechanicDetails.mechanicTotal).toFixed(2)})
              </Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.col25}>Shop</Text>
                  <Text style={styles.col25}>Service</Text>
                  <Text style={styles.col15}>Amount</Text>
                </View>
                {MechanicDetails.mechanicServices.map((m, i) => {
                  const showRow =
                    (m.shop && m.shop.trim() !== '') ||
                    (m.service && m.service.trim() !== '') ||
                    (parseFloat(m.amount) || 0) > 0;

                  return (
                    showRow && (
                      <View key={i} style={styles.tableRow}>
                        <Text style={styles.col25}>{m.shop}</Text>
                        <Text style={styles.col25}>{m.service}</Text>
                        <Text style={styles.col15}>${Number(m.amount).toFixed(2)}</Text>
                      </View>
                    )
                  );
                })}
              </View>
              {MechanicDetails.mechanicNotes && (
                <Text style={styles.notes}>Notes: {MechanicDetails.mechanicNotes}</Text>
              )}
            </View>
          )}


        {/* Bodyshop Section */}
        {/* Bodyshop Section */}
        {BodyshopDetails.bodyshopServices?.some(
          (b) =>
            (b.shop && b.shop.trim() !== '') ||
            (b.service && b.service.trim() !== '') ||
            (parseFloat(b.amount) || 0) > 0
        ) && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>
                Bodyshop Details (Total: ${Number(BodyshopDetails.bodyshopTotal).toFixed(2)})
              </Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.col25}>Shop</Text>
                  <Text style={styles.col25}>Service</Text>
                  <Text style={styles.col15}>Amount</Text>
                </View>
                {BodyshopDetails.bodyshopServices.map((b, i) => {
                  const showRow =
                    (b.shop && b.shop.trim() !== '') ||
                    (b.service && b.service.trim() !== '') ||
                    (parseFloat(b.amount) || 0) > 0;

                  return (
                    showRow && (
                      <View key={i} style={styles.tableRow}>
                        <Text style={styles.col25}>{b.shop}</Text>
                        <Text style={styles.col25}>{b.service}</Text>
                        <Text style={styles.col15}>${Number(b.amount).toFixed(2)}</Text>
                      </View>
                    )
                  );
                })}
              </View>
              {BodyshopDetails.bodyshopNotes && (
                <Text style={styles.notes}>Notes: {BodyshopDetails.bodyshopNotes}</Text>
              )}
            </View>
          )}


        {/* Misc Section */}
        {/* Misc Section */}
        {MiscellaniousDetails.miscServices?.some(
          (m) =>
            (m.name && m.name.trim() !== '') ||
            (m.service && m.service.trim() !== '') ||
            (parseFloat(m.amount) || 0) > 0
        ) && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>
                Miscellaneous Details (Total: ${Number(MiscellaniousDetails.miscTotal).toFixed(2)})
              </Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.col25}>Provider</Text>
                  <Text style={styles.col25}>Service</Text>
                  <Text style={styles.col15}>Amount</Text>
                </View>
                {MiscellaniousDetails.miscServices.map((m, i) => {
                  const showRow =
                    (m.name && m.name.trim() !== '') ||
                    (m.service && m.service.trim() !== '') ||
                    (parseFloat(m.amount) || 0) > 0;

                  return (
                    showRow && (
                      <View key={i} style={styles.tableRow}>
                        <Text style={styles.col25}>{m.name}</Text>
                        <Text style={styles.col25}>{m.service}</Text>
                        <Text style={styles.col15}>${Number(m.amount).toFixed(2)}</Text>
                      </View>
                    )
                  );
                })}
              </View>
              {MiscellaniousDetails.miscNotes && (
                <Text style={styles.notes}>Notes: {MiscellaniousDetails.miscNotes}</Text>
              )}
            </View>
          )}


        {/* Sale Section */}
        {(
          saleDetails.saleType ||
          saleDetails.saleDate ||
          saleDetails.saleAmount > 0 ||
          saleDetails.sellerFees > 0 ||
          saleDetails.soldTo ||
          saleDetails.salesmanName ||
          saleDetails.commission > 0 ||
          InvoiceDetails.grossProfit > 0 ||
          InvoiceDetails.netProfit > 0 ||
          saleDetails.saleNotes
        ) && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>
                Sale Details {saleDetails.saleType ? `(${saleDetails.saleType})` : ''}
              </Text>

              {(saleDetails.saleDate || saleDetails.saleAmount || saleDetails.sellerFees || InvoiceDetails.grossProfit) && (
                <View style={styles.row}>
                  {saleDetails.saleDate && (
                    <Text>Sale Date: {new Date(saleDetails.saleDate).toLocaleDateString()}</Text>
                  )}
                  {saleDetails.saleAmount > 0 && (
                    <Text>Sale Amount: ${Number(saleDetails.saleAmount).toFixed(2)}</Text>
                  )}
                  {saleDetails.sellerFees > 0 && (
                    <Text>Fees: ${Number(saleDetails.sellerFees).toFixed(2)}</Text>
                  )}
                  {InvoiceDetails.grossProfit > 0 && (
                    <Text>Profit: ${Number(InvoiceDetails.grossProfit).toFixed(2)}</Text>
                  )}
                </View>
              )}

              {(saleDetails.soldTo || saleDetails.salesmanName || saleDetails.commission > 0 || InvoiceDetails.netProfit > 0) && (
                <View style={styles.row}>
                  {saleDetails.soldTo && <Text>Sold To: {saleDetails.soldTo}</Text>}
                  {saleDetails.salesmanName && <Text>Salesman: {saleDetails.salesmanName}</Text>}
                  {saleDetails.commission > 0 && (
                    <Text>Commission: ${Number(saleDetails.commission).toFixed(2)}</Text>
                  )}
                  {InvoiceDetails.netProfit > 0 && (
                    <Text>Net Profit: ${Number(InvoiceDetails.netProfit).toFixed(2)}</Text>
                  )}
                </View>
              )}

              {saleDetails.saleNotes && (
                <Text style={styles.notes}>Notes: {saleDetails.saleNotes}</Text>
              )}
            </View>
          )}


        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Financial Summary</Text>

          <View style={styles.summaryRow}>
            <Text>SALE</Text>
            <Text>${Number(InvoiceDetails.sale).toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>COST</Text>
            <Text>(${Number(InvoiceDetails.totalCost).toFixed(2)})</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>PROFIT</Text>
            <Text>${Number(InvoiceDetails.grossProfit).toFixed(2)}</Text>
          </View>

          {InvoiceDetails.commission > 0 && (
            <View style={styles.summaryRow}>
              <Text>COMMISSION</Text>
              <Text>(${Number(InvoiceDetails.commission).toFixed(2)})</Text>
            </View>
          )}

          {InvoiceDetails.netProfit !== InvoiceDetails.grossProfit && (
            <View style={[styles.summaryRow, styles.bold]}>
              <Text>NET PROFIT</Text>
              <Text>${Number(InvoiceDetails.netProfit).toFixed(2)}</Text>
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
};

export default InvoicePDF;
