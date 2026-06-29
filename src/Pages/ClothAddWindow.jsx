import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCloth } from "../Context/ClothSlice";

// ✅ Fix: accept onClose prop so the Close button actually works
function ClothAddWindow({ onClose }) {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

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

  const addHandler = (data) => {
    dispatch(addCloth(data));
    onClose(); // close after adding
  };

  return (
    <>
      <div className="field-group">
        <label className="field-label">Name</label>
        <input
          className="field-input"
          type="text"
          placeholder="e.g. Kurta"
          {...register("name", { required: true })}
        />
      </div>
      <div className="field-group">
        <label className="field-label">Labour Charges</label>
        <input
          className="field-input"
          type="number"
          placeholder="e.g. 20"
          {...register("labourCharge", { required: true })}
        />
      </div>

      <label className="field-label">Sizing</label>

      <table className="results-table">
        <thead>
          <tr>
            <th>Size</th>
            <th>Cloth Used</th>
          </tr>
        </thead>
        <tbody>
          {sizeData.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  defaultValue={item.label}
                  className="field-input"
                  {...register(`sizes.${index}.label`)}
                />
              </td>
              <td>
                <input
                  type="number"
                  defaultValue={item.actual}
                  className="field-input"
                  {...register(`sizes.${index}.actual`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="edit-actions">
        <div
          className="calc-btn flex justify-center"
          onClick={handleSubmit(addHandler)}
        >
          Add Cloth
        </div>
      </div>
      <div className="edit-actions">
        <div
          className="calc-btn flex justify-center"
          onClick={onClose} // ✅ Fix: was commented out
          style={{ backgroundColor: "green" }}
        >
          Close
        </div>
      </div>
    </>
  );
}

export default ClothAddWindow;
