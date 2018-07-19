const OrderItem =`
 type OrderItem {
  orderItemID: ID!
  quantity: Int
  totalsumwithdph: Float
  totalsumwithoutdph: Float
  products: [Product]
  orders: [Order]
 }

`;
export default OrderItem;