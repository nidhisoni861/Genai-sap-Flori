// Sends an approved booking request to S/4HANA as a sales order.
// Uses SAP's Sales Order API (API_SALES_ORDER_SRV). In this project S/4HANA is simulated (mock).
import cds from '@sap/cds';

export function toSalesOrder(b) {
  return {
    SalesOrderType: 'OR', SalesOrganization: '1010', DistributionChannel: '10', OrganizationDivision: '00',
    SoldToParty: b.customerNumber,
    PurchaseOrderByCustomer: b.requestNumber,
    RequestedDeliveryDate: b.departureDate,
    to_Item: [{
      Material: b.tripProductCode,
      RequestedQuantity: b.numberOfTravellers,
      // Custom trips (from the TravelOrder Assistant) have no list price: the customer budget is the net amount.
      ...(b.tripProductCode === 'TRIPCUSTOM' ? { NetAmount: b.budget } : {})
    }]
  };
}

export async function createSalesOrder(b) {
  try {
    // Real S/4HANA when a destination/credentials are configured; otherwise the simulated S/4HANA (MockS4Service).
    const useReal = Boolean(cds.env.requires.API_SALES_ORDER_SRV?.credentials);
    const s4 = await cds.connect.to(useReal ? 'API_SALES_ORDER_SRV' : 'MockS4Service');
    const { A_SalesOrder } = s4.entities;
    const created = await s4.run(INSERT.into(A_SalesOrder).entries(toSalesOrder(b)));
    let number = created?.SalesOrder;
    if (!number) {
      const last = await s4.run(SELECT.one.from(A_SalesOrder).columns('SalesOrder')
        .where({ PurchaseOrderByCustomer: b.requestNumber }).orderBy('SalesOrder desc'));
      number = last?.SalesOrder;
    }
    if (!number) return { ok: false, message: 'S/4HANA did not return a sales order number.' };
    return { ok: true, salesOrder: number };
  } catch (e) {
    const details = (e.details || []).map(d => d.message).filter(Boolean);
    return { ok: false, message: (details.length ? details.join(' ') : e.message || 'Unknown error.').slice(0, 500) };
  }
}
