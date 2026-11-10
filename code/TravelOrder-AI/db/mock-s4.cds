// MOCK S/4HANA storage (university project, professor approved: no real S/4HANA).
// Field names and types follow SAP's official API_SALES_ORDER_SRV (subset of fields).
namespace mocks4;

entity A_SalesOrder {
  key SalesOrder             : String(10);
  SalesOrderType             : String(4);
  SalesOrganization          : String(4);
  DistributionChannel        : String(2);
  OrganizationDivision       : String(2);
  SoldToParty                : String(10);
  PurchaseOrderByCustomer    : String(35);
  RequestedDeliveryDate      : Date;
  TotalNetAmount             : Decimal(16, 3);
  TransactionCurrency        : String(5);
  CreationDate               : Date;
  OverallSDProcessStatus     : String(1);
  to_Item                    : Composition of many A_SalesOrderItem on to_Item.SalesOrder = SalesOrder;
}

entity A_SalesOrderItem {
  key SalesOrder             : String(10);
  key SalesOrderItem         : String(6);
  Material                   : String(40);
  SalesOrderItemText         : String(40);
  RequestedQuantity          : Decimal(15, 3);
  RequestedQuantityUnit      : String(3);
  NetAmount                  : Decimal(16, 3);
  TransactionCurrency        : String(5);
}
