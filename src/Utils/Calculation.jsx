export function calculation({
  labourCharge,
  sizes,
  price,
  embroideryCharge,
  extraCharge,
}) {
  const prices = sizes.map((item) => {
    let base = (Number(item.actual) / 100) * parseFloat(price || 0);

    if (embroideryCharge) base += parseFloat(embroideryCharge || 0);
    if (extraCharge) base += parseFloat(extraCharge || 0);

    base += parseFloat(labourCharge || 0);

    const sale = base * 1.4;
    const gstAmount = sale * 0.05;

    return {
      size: item.label,
      costPrice: base.toFixed(2),
      salePrice: (sale + gstAmount).toFixed(2),
      profit: (sale + gstAmount - base).toFixed(2),
    };
  });

  return prices;
}
