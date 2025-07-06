import { useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const formatDate = (date) => {
  return format(parseISO(date), "MMM d, yyyy");
};

export const calculateTaxAndServiceFee = (total, fees) => {
  const result = (fees / 100) * total;
  return +result.toFixed(2);
};

export const calculateTotalPayment = (total, fees) => {
  const result = total + calculateTaxAndServiceFee(total, fees);
  return result.toFixed(2);
};
