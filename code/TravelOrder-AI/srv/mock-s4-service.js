// MOCK S/4HANA - not a real SAP system.
// Used only while no real S/4HANA is connected (university project, professor approved).
// It follows SAP's official API_SALES_ORDER_SRV format and checks orders the way SAP would.
import cds from '@sap/cds';

// Invented master data that matches the sample booking requests.
export const CUSTOMERS = {
  CUST12345: 'Sample Customer 12345', CUST54321: 'Sample Customer 54321', CUST67890: 'Sample Customer 67890',
  CUST11223: 'Sample Customer 11223', CUST33445: 'Sample Customer 33445', CUST55667: 'Sample Customer 55667',
  CUST77889: 'Sample Customer 77889', CUST99001: 'Sample Customer 99001', CUST22334: 'Sample Customer 22334',
  CUST44556: 'Sample Customer 44556'
};
// Price per traveller.
export const PRODUCTS = {
  TRIPITALY2024: { text: 'Italy trip', price: 1100, currency: 'EUR' },
  TRIPBERLIN2024: { text: 'Berlin city trip', price: 600, currency: 'EUR' },
  TRIPSPAIN2024: { text: 'Mallorca beach trip', price: 750, currency: 'EUR' },
  TRIPAUSTRIA2024: { text: 'Tirol mountain trip', price: 900, currency: 'EUR' },
  TRIPPARIS2024: { text: 'Paris city trip', price: 800, currency: 'EUR' },
  TRIPCROATIA2024: { text: 'Dubrovnik coast trip', price: 1050, currency: 'EUR' },
  TRIPNZ2024: { text: 'New Zealand round trip', price: 3200, currency: 'USD' },
  TRIPJAPAN2024: { text: 'Japan round trip', price: 2600, currency: 'EUR' },
  TRIPMALDIVES2024: { text: 'Maldives beach trip', price: 3500, currency: 'USD' },
  TRIPPRAGUE2024: { text: 'Prague city trip', price: 700, currency: 'EUR' }
};
const ORG = { SalesOrderType: 'OR', SalesOrganization: '1010', DistributionChannel: '10', OrganizationDivision: '00' };

export default class MockS4Service extends cds.ApplicationService {
  init() {
    const { A_SalesOrder, A_SalesOrderItem } = this.entities;

    this.before('CREATE', A_SalesOrder, async req => {
      const d = req.data;
      for (const [field, value] of Object.entries(ORG)) {
        if (d[field] !== value) req.error(400, `${field} must be ${value} in this sales area.`);
      }
      if (!CUSTOMERS[d.SoldToParty]) req.error(400, `Sold-to party ${d.SoldToParty || '(empty)'} does not exist.`);
      if (!d.PurchaseOrderByCustomer) req.error(400, 'Customer reference (PurchaseOrderByCustomer) is required.');
      const items = d.to_Item || [];
      if (!items.length) req.error(400, 'A sales order needs at least one item.');
      for (const it of items) {
        if (!PRODUCTS[it.Material]) req.error(400, `Material ${it.Material || '(empty)'} does not exist.`);
        const q = Number(it.RequestedQuantity);
        if (!Number.isInteger(q) || q < 1) req.error(400, `Quantity for ${it.Material} must be a whole number of at least 1.`);
      }
      if (req.errors) return;

      const last = await SELECT.one.from(A_SalesOrder).columns('max(SalesOrder) as max');
      const number = String(Math.max(Number(last?.max) || 0, 5000000) + 1);
      const today = new Date().toISOString();
      let total = 0;
      req._items = items.map((it, i) => {
        const p = PRODUCTS[it.Material];
        const amount = p.price * Number(it.RequestedQuantity);
        total += amount;
        return { SalesOrder: number, SalesOrderItem: String((i + 1) * 10), Material: it.Material, SalesOrderItemText: p.text,
          RequestedQuantity: Number(it.RequestedQuantity), RequestedQuantityUnit: 'EA', NetAmount: amount, TransactionCurrency: p.currency };
      });
      d.to_Item = req._items;
      Object.assign(d, { SalesOrder: number, TotalNetAmount: total, TransactionCurrency: req._items[0].TransactionCurrency,
        CreationDate: today.slice(0, 10), OverallSDProcessStatus: 'A' });
    });


    return super.init();
  }
}
