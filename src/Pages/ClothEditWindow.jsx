import React from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ Fix 1: import useDispatch
import { updateCloth } from "../Context/ClothSlice";
import { useForm } from "react-hook-form";

// ✅ Fix 3: accept editMode and onClose as separate props (was <ClothEditWindow id={{ editMode }} />)
function ClothEditWindow({ editMode, onClose }) {
  const dispatch = useDispatch(); // ✅ Fix 1: declare dispatch
  const allClothPrices = useSelector((state) => state.cloth.clothes);
  const { register, handleSubmit } = useForm();

  const cloth = allClothPrices.find((c) => c.id === editMode); // ✅ Fix 2: was c.id = editMode (assignment bug)
  const sizes = cloth?.sizes || [];

  const updateHandler = (data) => {
    dispatch(updateCloth({ id: editMode, ...data }));
    onClose(); // ✅ Fix 4: close edit window after saving
  };

  return (
    <div>
      <form>
        <p className="section-label">
          Editing: <strong>{cloth?.name}</strong>
        </p>

        <div className="field-group">
          <label className="field-label">Cloth Name</label>
          <input
            className="field-input"
            type="text"
            defaultValue={cloth?.name}
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
            defaultValue={cloth?.charges}
            {...register("charges", { required: true })}
          />
        </div>

        <label className="field-label">Sizing</label>

        <table className="results-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Cloth Used </th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((item, index) => (
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
          <button
            type="button"
            onClick={handleSubmit(updateHandler)}
            className="calc-btn"
          >
            Save Changes
          </button>
        </div>

        <div className="edit-actions">
          <button
            type="button"
            className="calc-btn"
            onClick={onClose} // ✅ Fix 4: close on cancel
            style={{ backgroundColor: "green" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClothEditWindow;
