import React, { useState } from "react";
import { useSelector } from "react-redux";

export function calculation({
  labourCharge,
  id,
  price,
  embroideryCharges,
  extraCharges,
}) {
  const costPrice = true;
  const withGST = true;

  const sizeData = [
    { label: 20, actual: 105 },
    { label: 22, actual: 105 },
    { label: 24, actual: 105 },
    { label: 26, actual: 105 },
    { label: 28, actual: 105 },
    { label: 30, actual: 105 },
    { label: 32, actual: 105 },
    { label: 34, actual: 105 },
    { label: 36, actual: 105 },
    { label: 38, actual: 105 },
    { label: 40, actual: 105 },
    { label: 42, actual: 105 },
  ];

  const prices = sizeData.map((item) => {
    let base = (item.actual / 100) * parseFloat(price || 0);

    if (embroideryCharges) {
      base += parseFloat(embroideryCharges || 0);
    }

    if (extraCharges) {
      base += parseFloat(extraCharges || 0);
    }

    base += parseFloat(labourCharge);

    const gstAmount = base * 1.4 * 0.05;
    const sale = base * 1.4;

    const priceObj = {
      size: item.label,
    };

    if (costPrice) {
      priceObj.costPrice = base.toFixed(2);
      priceObj.salePrice = withGST
        ? (sale + gstAmount).toFixed(2)
        : sale.toFixed(2);
      priceObj.profit = (parseFloat(priceObj.salePrice) - base).toFixed(2);
    } else {
      priceObj.salePrice = sale.toFixed(2);
    }
    if (withGST) {
      priceObj.salePrice = (sale + gstAmount).toFixed(2);
    }

    return priceObj;
  });
  return prices;
}
