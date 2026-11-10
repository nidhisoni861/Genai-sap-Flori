using { mocks4 } from '../db/mock-s4';

// MOCK S/4HANA sales order API (simulated, see db/mock-s4.cds).
@path: 'mock-s4'
service MockS4Service {
  entity A_SalesOrder     as projection on mocks4.A_SalesOrder;
  entity A_SalesOrderItem as projection on mocks4.A_SalesOrderItem;
}
