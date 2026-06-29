import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ClothAddWindow from "./ClothAddWindow";
import ClothEditWindow from "./ClothEditWindow";
import { calculation } from "../Utils/Calculation";
import { removeCloth } from "../Context/ClothSlice";

function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const allClothPrices = useSelector((state) => state.cloth.clothes);
  const [editMode, setEditMode] = useState(null);
  const [summary, setSummary] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [addWindow, setAddWindow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [result, setResult] = useState(null);

  const dispatch = useDispatch();

  const removeHandler = (id) => {
    dispatch(removeCloth(id));
    if (selectedId === id) setSelectedId(null);
  };

  const sendPrices = (data) => {
    console.log("triggering1");
    const cloth = allClothPrices.find((item) => item.id == selectedId);
    console.log(data.clothType);
    if (!cloth) return;

    const res = calculation({
      labourCharge: cloth.charges,
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
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.setItem("clothes", JSON.stringify(allClothPrices));
  }, [allClothPrices]);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">Garment Price Calculator</h1>
        <p className="home-subtitle">Cost &amp; Margin Breakdown by Size</p>
      </div>

      <div className="home-layout">
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

            {/* Add window */}
            {addWindow && !editMode && (
              <ClothAddWindow onClose={() => setAddWindow(false)} />
            )}

            {/* Edit window */}
            {/* ✅ Fix: was <ClothEditWindow id={{ editMode }} /> — wrong prop shape */}
            {editMode && !addWindow && (
              <ClothEditWindow
                editMode={editMode}
                onClose={() => setEditMode(null)}
              />
            )}

            {/* Normal price entry */}
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

        {/* Results Card */}
        {result && summary && (
          <div className="home-results-card" id="print-area">
            <div className="results-header">
              <h2 className="results-title">Price Breakdown</h2>
              <button
                className="print-btn no-print"
                onClick={() => window.print()}
              >
                🖨 Print
              </button>
            </div>

            <div className="price-summary">
              <div className="summary-row">
                <label className="field-label">
                  Fabric Price ₹{summary.fabricPrice}
                </label>
              </div>
              <div className="summary-row">
                <label className="field-label">
                  Embroidery Charges ₹{summary.embroideryCharge}
                </label>
              </div>
              {summary.extraCharge > 0 && (
                <div className="summary-row">
                  <label className="field-label">
                    Extra Charges ₹{summary.extraCharge}
                  </label>
                </div>
              )}
            </div>

            <table className="results-table">
              <thead>
                <tr>
                  <th>Size</th>
                  {adminMode && <th>Cost Price (₹)</th>}
                  <th>Sale Price (₹)</th>
                  {adminMode && <th>Profit (₹)</th>}
                </tr>
              </thead>
              <tbody>
                {result.map((item, index) => (
                  <tr key={index}>
                    <td>{item.size}</td>
                    {adminMode && <td>₹{item.costPrice}</td>}
                    <td>₹{item.salePrice}</td>
                    {adminMode && (
                      <td className="profit-cell">₹{item.profit}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="results-date">
              Generated on{" "}
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
