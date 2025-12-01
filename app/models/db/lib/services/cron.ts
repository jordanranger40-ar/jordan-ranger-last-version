import { clearExpiredCart } from "../services/cart";


if (process.env.NODE_ENV === "development") {
  clearExpiredCart(); 
}
