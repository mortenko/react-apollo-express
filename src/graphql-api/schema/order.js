const Order = `
 type Order {
  orderID: ID
  createdAt: Date 
  customer: Customer
 }
 type Orders implements IPagination {
   orders: [OrderItem] 
   count: Int!
   cursor: Int!
  }
  extend type Query {
   orders(cursor: Int!, pageNumber: Int!): Orders
  }
`;

export default Order;
