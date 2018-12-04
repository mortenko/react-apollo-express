const SELECT_ORDERS =
  'SELECT "oi"."orderItemID","oi"."orderID", "oi"."quantity","oi"."totalsumwithoutdph", "oi"."totalsumwithdph", "oi"."createdAt" as "createdAt", "oi"."updatedAt" as "updatedAt","c"."customerID","c"."firstname","c"."lastname","c"."email","oi"."productID", "productname" ' +
  'FROM "OrderItems" AS "oi" ' +
  'INNER JOIN "Orders" ON "oi"."orderID" = "Orders"."orderID"' +
  'INNER JOIN "Products" ON "oi"."productID" = "Products"."productID" ' +
  'INNER JOIN "Customers" as "c" ON "Orders"."orderID" = "c"."customerID"' +
  'LIMIT :limit OFFSET :offset ';
const COUNT_ALL_ORDERS =
  'SELECT count("OrderItem"."orderItemID") AS "count"' +
  'FROM "OrderItems" AS "OrderItem" ' +
  'INNER JOIN "Products" AS "Product" ON "OrderItem"."productID" = "Product"."productID" ' +
  'INNER JOIN "Orders" AS "Orders" ON "OrderItem"."orderID" = "Orders"."orderID"' +
  'LEFT OUTER JOIN "Customers" AS "Customer" ON "Orders"."customerID" = "Customer"."customerID"';

export { SELECT_ORDERS, COUNT_ALL_ORDERS };

