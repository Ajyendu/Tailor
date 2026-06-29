import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ClothAddWindow from "./ClothAddWindow";
import { calculation } from "../Utils/Calculation";
import { removeCloth, updateCloth } from "../Context/ClothSlice"; // ✅ added updateCloth import

function Home() {
  const { register, handleSubmit } = useForm();

  // ✅ Fixed: was `const {editMode, setEditMode} = useState()` — destructuring useState returns an array, not an object
  const [editMode, setEditMode] = useState(null);
  const [summary, setSummary] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [addWindow, setAddWindow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [result, setResult] = useState(null);

  const allClothPrices = useSelector((state) => state.clothes);
  const dispatch = useDispatch();

  const removeHandler = (id) => {
    dispatch(removeCloth(id));
    if (selectedId === id) setSelectedId(null);
  };

  // ✅ Fixed: was referencing `id` which is not in scope — use `editMode` as the id
  const updateHandler = (data) => {
    dispatch(updateCloth({ id: editMode, ...data }));
    setEditMode(null);
  };

  const sendPrices = (data) => {
    const cloth = allClothPrices.find((item) => item.id == data.clothType);
    const labourCharge = cloth?.charges || 0;
    const res = calculation({
      labourCharge,
      id: data.clothType,
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

  return (
    <div className="home-page">
      {/* ── Header ── */}
      <div className="home-header">
        <h1 className="home-title">Garment Price Calculator</h1>
        <p className="home-subtitle">Cost &amp; Margin Breakdown by Size</p>
      </div>

      <div className="home-layout">
        {/* ── Form Card ── */}
        <div className="home-card no-print">
          <button
            className="admin-btn"
            onClick={() => setAdminMode(!adminMode)}
          >
            {adminMode ? "✓ Admin On" : "Admin"}
          </button>

          <div className="section-label">Clothing Type</div>

          <form onSubmit={handleSubmit(editMode ? updateHandler : sendPrices)}>
            <div className="cloth-types">
              {allClothPrices.map(({ id, name }) => (
                <label key={id}>
                  {/* ✅ Fixed: `{...register("clothType"), {required: ...}}` is a comma expression bug
                       — spread only the register return value; validation goes inside register() */}
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
                        {/* ✅ Fixed: edit button was also showing "✕" and had no distinct action — now shows ✎ */}
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
            </div>

            {/* Add window */}
            {addWindow && !editMode && (
              <div>
                <ClothAddWindow />
                <div className="edit-actions">
                  <div
                    className="calc-btn flex justify-center"
                    onClick={() => setAddWindow(false)}
                    style={{ backgroundColor: "green" }}
                  >
                    Close
                  </div>
                </div>
              </div>
            )}

            {/* Edit mode — update labour/name for the selected cloth type */}
            {editMode && !addWindow && (
              <div>
                <p className="section-label">
                  Editing:{" "}
                  <strong>
                    {allClothPrices.find((c) => c.id === editMode)?.name}
                  </strong>
                </p>

                <div className="field-group">
                  <label className="field-label">Cloth Name</label>
                  <input
                    className="field-input"
                    type="text"
                    defaultValue={
                      allClothPrices.find((c) => c.id === editMode)?.name
                    }
                    placeholder="e.g. Kurta"
                    {...register("name", { required: true })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Labour Charges (₹)</label>
                  <input
                    className="field-input"
                    type="number"
                    placeholder="0"
                    defaultValue={
                      allClothPrices.find((c) => c.id === editMode)?.charges
                    }
                    {...register("charges", { required: true })}
                  />
                </div>

                <div className="edit-actions">
                  <button
                    type="submit"
                    onClick={() => setEditMode(false)}
                    className="calc-btn"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="edit-actions">
                  <button
                    type="submit"
                    className="calc-btn"
                    onClick={() => setEditMode(null)}
                    style={{ backgroundColor: "Green" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
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
                    {...register("embroideryCharge", { required: true })}
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

                <button type="submit" className="calc-btn">
                  Calculate Prices
                </button>
              </>
            )}
          </form>
        </div>

        {/* ── Results Card ── */}
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
