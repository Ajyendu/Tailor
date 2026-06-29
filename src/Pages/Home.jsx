import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ClothAddWindow from "./ClothAddWindow";
import ClothEditWindow from "./ClothEditWindow";
import { calculation } from "../Utils/Calculation";
import { removeCloth } from "../Context/ClothSlice";

/* ── Print styles injected once ── */
const PRINT_STYLE = `
@media print {
  body * { visibility: hidden !important; }
  #print-area, #print-area * { visibility: visible !important; }
  #print-area {
    position: fixed !important;
    inset: 0 !important;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    font-family: Arial, sans-serif !important;
  }
  .no-print { display: none !important; }
  .print-notes { display: block !important; }
}

/* ── Quotation card styles (screen + print) ── */
.quotation-wrap {
  font-family: Arial, sans-serif;
  font-size: 13px;
  color: #222;
  border: 1px solid #bbb;
  max-width: 860px;
  margin: 0 auto;
  background: #fff;
}

/* header banner */
.quot-banner {
  background: #c8956c;
  text-align: center;
  padding: 6px 0;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 2px;
  color: #fff;
  border-bottom: 1px solid #a0724a;
}

/* company block */
.quot-company {
  text-align: center;
  padding: 10px 12px 8px;
  border-bottom: 1px solid #bbb;
  line-height: 1.55;
}
.quot-company-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 2px;
}
.quot-company-sub {
  font-size: 12px;
  color: #444;
  margin: 0;
}

/* billing + meta row */
.quot-meta-row {
  display: flex;
  border-bottom: 1px solid #bbb;
}
.quot-billing {
  flex: 1;
  padding: 10px 12px;
  border-right: 1px solid #bbb;
  font-size: 12px;
  line-height: 1.6;
}
.quot-billing strong { display: block; font-size: 13px; margin-bottom: 4px; }
.quot-info {
  width: 280px;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.9;
}
.quot-info-row { display: flex; }
.quot-info-label { width: 130px; font-weight: 600; color: #555; }

/* notes textarea */
.quot-notes-wrap {
  padding: 8px 12px;
  border-bottom: 1px solid #bbb;
  background: #fafaf6;
}
.quot-notes-label {
  font-size: 11px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
  display: block;
}
.quot-notes-input {
  width: 100%;
  min-height: 70px;
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 13px;
  font-family: Arial, sans-serif;
  resize: vertical;
  background: #fffef8;
  box-sizing: border-box;
  color: #333;
  outline: none;
}
.quot-notes-input:focus { border-color: #c8956c; }

/* table */
.quot-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.quot-table th {
  background: #e8e0c8;
  padding: 7px 10px;
  font-weight: 700;
  border: 1px solid #bbb;
  text-align: center;
}
.quot-table td {
  padding: 7px 10px;
  border: 1px solid #ddd;
  text-align: center;
  vertical-align: middle;
}
.quot-table tbody tr:nth-child(even) { background: #fafaf4; }

/* total row */
.quot-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e8e0c8;
  padding: 7px 14px;
  font-weight: 700;
  font-size: 14px;
  border-top: 2px solid #bbb;
}

/* words row */
.quot-words-row {
  padding: 6px 12px;
  font-size: 12px;
  font-style: italic;
  border-top: 1px solid #ddd;
  color: #333;
}

/* date line */
.quot-date {
  text-align: right;
  font-size: 11px;
  color: #888;
  padding: 4px 12px 8px;
}
`;

/* tiny helper: number → words (up to lakhs) */
function numberToWords(num) {
  const n = Math.round(num);
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000)
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + numberToWords(n % 100) : "")
    );
  if (n < 100000)
    return (
      numberToWords(Math.floor(n / 1000)) +
      " Thousand" +
      (n % 1000 ? " " + numberToWords(n % 1000) : "")
    );
  return (
    numberToWords(Math.floor(n / 100000)) +
    " Lakh" +
    (n % 100000 ? " " + numberToWords(n % 100000) : "")
  );
}

function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const allClothPrices = useSelector((state) => state.cloth.clothes);
  const [editMode, setEditMode] = useState(null);
  const [summary, setSummary] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [addWindow, setAddWindow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [result, setResult] = useState(null);
  const [notes, setNotes] = useState("");
  const [quotNum, setQuotNum] = useState(() => {
    const saved = localStorage.getItem("quotNum");
    return saved ? parseInt(saved) : 1;
  });

  const dispatch = useDispatch();

  const removeHandler = (id) => {
    const cloth = allClothPrices.find((item) => item.id === id);
    const name = cloth ? cloth.name : "this item";
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    dispatch(removeCloth(id));
    if (selectedId === id) setSelectedId(null);
  };

  const sendPrices = (data) => {
    const cloth = allClothPrices.find((item) => item.id == selectedId);
    if (!cloth) return;
    const res = calculation({
      sizes: cloth.sizes,
      price: data.fabricPrice,
      embroideryCharge: data.embroideryCharge,
      extraCharge: data.extraCharge,
    });
    setResult(res);
    setSummary({
      fabricPrice: data.fabricPrice,
      embroideryCharge: data.embroideryCharge || 0,
      extraCharge: data.extraCharge || 0,
      clothName: cloth.name,
    });
  };

  const handlePrint = () => {
    const next = quotNum + 1;
    setQuotNum(next);
    localStorage.setItem("quotNum", next);
    window.print();
  };

  useEffect(() => {
    localStorage.setItem("clothes", JSON.stringify(allClothPrices));
  }, [allClothPrices]);

  /* inject print CSS once */
  useEffect(() => {
    const id = "pawan-print-style";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = PRINT_STYLE;
      document.head.appendChild(el);
    }
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const totalSale = result
    ? result.reduce((s, r) => s + parseFloat(r.salePrice), 0)
    : 0;
  const quotLabel =
    String(quotNum).padStart(4, "0") +
    "/" +
    (today.getFullYear() % 100) +
    "-" +
    String((today.getFullYear() % 100) + 1).slice(-2);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">Garment Price Calculator</h1>
        <p className="home-subtitle">Cost &amp; Margin Breakdown by Size</p>
      </div>

      <div className="home-layout">
        {/* ── Input card (hidden on print) ── */}
        <div className="home-card no-print">
          <button
            className="admin-btn"
            onClick={() => setAdminMode(!adminMode)}
          >
            {adminMode ? "✓ Admin On" : "Admin"}
          </button>

          <div className="section-label">Clothing Type</div>

          <form onSubmit={handleSubmit(sendPrices)}>
            <div className="cloth-types">
              {allClothPrices.map(({ id, name }) => (
                <label key={id}>
                  <input
                    className="cloth-chip-input"
                    type="radio"
                    value={id}
                    {...register("clothType", {
                      required: "Please select a clothing type",
                    })}
                    onChange={() => {
                      setSelectedId(id);
                      setAddWindow(false);
                    }}
                  />
                  <span
                    className={`cloth-chip${
                      selectedId === id ? " selected" : ""
                    }`}
                  >
                    {name}
                    {adminMode && (
                      <>
                        <button
                          type="button"
                          className="chip-remove-btn"
                          title="Remove"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeHandler(id);
                          }}
                        >
                          ✕
                        </button>
                        <button
                          type="button"
                          className="chip-edit-btn"
                          title="Edit"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditMode(id);
                            setAddWindow(false);
                          }}
                        >
                          ✎
                        </button>
                      </>
                    )}
                  </span>
                </label>
              ))}
              {adminMode && (
                <div className="edit-actions">
                  <button
                    type="button"
                    className="cloth-add-btn"
                    onClick={() => {
                      setAddWindow(true);
                      setSelectedId(null);
                      setEditMode(null);
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {addWindow && !editMode && (
              <ClothAddWindow onClose={() => setAddWindow(false)} />
            )}
            {editMode && !addWindow && (
              <ClothEditWindow
                editMode={editMode}
                onClose={() => setEditMode(null)}
              />
            )}

            {!addWindow && !editMode && (
              <>
                <div className="field-group">
                  <label className="field-label">Fabric Price (₹)</label>
                  <input
                    className="field-input"
                    type="number"
                    placeholder="0"
                    {...register("fabricPrice", { required: true })}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Embroidery Charges (₹)</label>
                  <input
                    className="field-input"
                    type="number"
                    placeholder="0"
                    {...register("embroideryCharge")}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Extra Charges (₹)</label>
                  <input
                    className="field-input"
                    type="number"
                    placeholder="0"
                    {...register("extraCharge")}
                  />
                </div>
                {errors.clothType && (
                  <p className="text-red-500">{errors.clothType.message}</p>
                )}
                <button type="submit" className="calc-btn">
                  Calculate Prices
                </button>
              </>
            )}
          </form>
        </div>

        {/* ── Quotation card ── */}
        {result && summary && (
          <div id="print-area">
            {/* Print button (hidden when printing) */}
            <div
              className="no-print"
              style={{ textAlign: "right", marginBottom: 8 }}
            >
              <button className="print-btn" onClick={handlePrint}>
                Print Quotation
              </button>
            </div>

            <div className="quotation-wrap">
              {/* Banner */}
              <div className="quot-banner">QUOTATION</div>

              {/* Company */}
              <div className="quot-company">
                <p className="quot-company-name">Pawan Uniforms</p>
                <p className="quot-company-sub">
                  Hathipur Kothar, Lakhimpur Kheri
                  <br />
                  <strong>Mobile:</strong> 8090589336 &nbsp;|&nbsp;{" "}
                  <strong>Mobile:</strong> 8574284184
                </p>
              </div>

              {/* Billing + Meta */}
              <div className="quot-meta-row">
                <div className="quot-billing">
                  <strong>Billing Details</strong>
                  Cloth Type: <strong>{summary.clothName}</strong>
                </div>
                <div className="quot-info">
                  <div className="quot-info-row">
                    <span className="quot-info-label">Quotation Number</span>
                    <span>: {quotLabel}</span>
                  </div>
                  <div className="quot-info-row">
                    <span className="quot-info-label">Quotation Date</span>
                    <span>: {dateStr}</span>
                  </div>
                  {adminMode && (
                    <>
                      <div className="quot-info-row">
                        <span className="quot-info-label">Fabric Price</span>
                        <span>: ₹{summary.fabricPrice}</span>
                      </div>
                      <div className="quot-info-row">
                        <span className="quot-info-label">Embroidery</span>
                        <span>: ₹{summary.embroideryCharge}</span>
                      </div>
                      {summary.extraCharge > 0 && (
                        <div className="quot-info-row">
                          <span className="quot-info-label">Extra Charges</span>
                          <span>: ₹{summary.extraCharge}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Notes / Details */}
              <div className="quot-notes-wrap">
                <span className="quot-notes-label">Order Notes / Details</span>
                <textarea
                  className="quot-notes-input no-print"
                  placeholder="e.g. School uniform – 50 pieces, Navy blue shirt + grey pant, delivery by 15 Aug..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                {/* Print version of notes */}
                <div
                  style={{
                    display: "none",
                    whiteSpace: "pre-wrap",
                    fontSize: 13,
                    padding: "4px 2px",
                    minHeight: 40,
                  }}
                  className="print-notes"
                >
                  {notes || "—"}
                </div>
              </div>

              {/* Table */}
              <table className="quot-table">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Size</th>
                    {adminMode && <th>Cost Price (₹)</th>}
                    <th>Sale Price (₹)</th>
                    {adminMode && <th>Making Charge (₹)</th>}
                    {adminMode && <th>Profit (₹)</th>}
                  </tr>
                </thead>
                <tbody>
                  {result.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.size}</td>
                      {adminMode && <td>₹{item.costPrice}</td>}
                      <td>₹{item.salePrice}</td>
                      {adminMode && <td>₹{item.makingCharge}</td>}
                      {adminMode && (
                        <td className="profit-cell">₹{item.profit}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="quot-total-row">
                <span>Total</span>
                <span>₹{totalSale.toFixed(2)}</span>
              </div>

              {/* Amount in words */}
              <div className="quot-words-row">
                Rs. {numberToWords(totalSale)} only
              </div>

              <div className="quot-date">Generated on {dateStr}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
