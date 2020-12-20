// import { PAYMENT_REQ_ADDED } from "../subscritionTag";
// import { withFilter } from "apollo-server";
// import { pubsub } from "../../utility";

// export const NewPaymentReq = {
//   subscribe: withFilter(
//     () => pubsub.asyncIterator([PAYMENT_REQ_ADDED]),
//     (payload, variables) => {
//       console.log({ payload, variables });
//       return payload.shopperId === variables.shopperId;
//     }
//   ),
// };
