import baseApi from "./baseApi";

const orderListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/api/orders",
      providesTags: ["Orders"],
    }),
    addOrder: builder.mutation({
      query: (bodyInfo) => ({
        url: "/api/orders",
        method: "POST",
        body: bodyInfo,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, orderStatus }) => ({
        url: "/api/orders",
        method: "PATCH",
        body: { id, orderStatus },
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useAddOrderMutation,
  useUpdateOrderStatusMutation,
} = orderListApi;

export default orderListApi;
