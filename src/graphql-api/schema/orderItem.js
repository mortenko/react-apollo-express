const OrderItem = `
 type OrderItem {
  orderItemID: ID!
  orderID: Int
  quantity: Int
  totalsumwithdph: Float
  totalsumwithoutdph: Float
  createdAt: Date
  updatedAt: Date
  product: Product
  customer: Customer
 }

 type Orders implements IPagination {
  orders: [OrderItem] 
  count: Int!
  cursor: Int! 
}

 input CreateOrderProduct {
   productID: String!
   productname: String!
   selectedQuantity: Int!
 }

 input CreateOrderInput {
  firstname: String!
  lastname: String!
  email:String!
  products:[CreateOrderProduct]
  totalsumwithoutdph: Float!
  totalsumwithdph: Float! 
 }

  type OrderItemProduct {
    productID: String!
    productname: String!
    selectedQuantity: Int!
    quantityRange: [Int]!
    pricewithoutdph: Float
    pricewithdph: Float  
    totalpricewithoutdph: Float,
    totalpricewithdph: Float
  }

  type OrderResponse {
    orderID: Int!
    firstname: String
    lastname: String
    email: String
    products:[OrderItemProduct]
    totalsumwithoutdph: Float!
    totalsumwithdph: Float!
  } 

  type OrderItemResponse {  
    order: OrderResponse
    mutationResponse: MutationResponse  
  }
 
  extend type Query {
   orders(cursor: Int!, pageNumber: Int!): Orders
   fetchOrdersByID(orderID: Int!): OrderItemResponse
  }

  extend type Mutation {
   createOrder(order: CreateOrderInput) : OrderItemResponse
   deleteOrder(orderID: Int!): OrderItemResponse
  }
`;
export default OrderItem;
