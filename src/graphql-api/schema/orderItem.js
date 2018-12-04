const OrderItem = `
 type OrderItem {
  orderItemID: ID!
  quantity: Int
  totalsumwithdph: Float
  totalsumwithoutdph: Float
  createdAt: Date
  updatedAt: Date
  product: Product
  customer: Customer
 }
`;
export default OrderItem;
