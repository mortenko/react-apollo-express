const Order = `
scalar Date
 type Order {
  orderID: ID
  createdAt: Date 
  Customer: Customer
  OrderItem: OrderItem
 }
  extend type Query {
   orders(cursor: Int!): [Order]
   order(id: ID!): Order
  }
  extend type Mutation {
    deleteOrder(orderID: ID!): Order
  
  }
`;

export default Order;
