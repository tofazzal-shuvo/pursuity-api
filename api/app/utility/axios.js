import Axios from "axios";

require("dotenv").config();

Axios.defaults.baseURL = "https://api.paystack.co/";
Axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${process.env.PAYSTACK_SECRET_KEY}`;
Axios.defaults.headers.common["Content-Type"] = "application/json";
Axios.defaults.headers.common["Cache-Control"] = "no-cache";

export { Axios };

// STELLA
// Test Secret Key sk_test_f7f990af0b166c89826f4a929a85d7886908c3ef

// Test Public Key pk_test_0d051958ea2e082c125e0c53ac99b00f7e01e532

// MINE
// Test Secret Key sk_test_846f70ec6392e8bb7aca228a92098c72ddadc89a

// Test Public Key pk_test_316f780a38daae0c1cc86c2696dd20fdad714a17
