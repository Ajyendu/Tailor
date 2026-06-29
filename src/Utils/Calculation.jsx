import { matchPath } from "react-router-dom";

export function calculation({ sizes, price, embroideryCharge, extraCharge }) {
  const prices = sizes.map((item, index) => {
    let base = (Number(item.actual) / 100) * parseFloat(price || 0);

    base += Number(item.makingCharge || 0);

    if (embroideryCharge) base += parseFloat(embroideryCharge || 0);
    if (extraCharge) base += parseFloat(extraCharge || 0);

    const sale = base * 1.4;

    return {
      size: item.label,
      makingCharge: item.makingCharge,
      costPrice: base.toFixed(2),
      salePrice: (sale + sale).toFixed(2),
      profit: (sale + sale - base).toFixed(2),
    };
  });

  return prices;
}
