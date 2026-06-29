import React from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ Fix 1: import useDispatch
import { updateCloth } from "../Context/ClothSlice";
import { useForm, useFieldArray } from "react-hook-form";

// ✅ Fix 3: accept editMode and onClose as separate props (was <ClothEditWindow id={{ editMode }} />)
function ClothEditWindow({ editMode, onClose }) {
  const allClothPrices = useSelector((state) => state.cloth.clothes);
  const cloth = allClothPrices.find((c) => c.id === editMode); // ✅ Fix 2: was c.id = editMode (assignment bug)
  const size = cloth?.sizes || [];
  const dispatch = useDispatch(); // ✅ Fix 1: declare dispatch

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: cloth?.name || "",
      sizes: cloth?.sizes || [],
    },
  });

  const updateHandler = (data) => {
    dispatch(updateCloth({ id: editMode, ...data }));
    onClose(); // ✅ Fix 4: close edit window after saving
  };
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "sizes",
  });

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

        <label className="field-label">Sizing</label>

        <table className="results-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Cloth Used </th>
              <th>Making Charge </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="number"
                    className="field-input"
                    {...register(`sizes.${index}.label`)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="field-input"
                    {...register(`sizes.${index}.actual`)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="field-input"
                    {...register(`sizes.${index}.makingCharge`)}
                  />
                </td>

                <td>
                  <button type="button" onClick={() => remove(index)}>
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insert(index + 1, {
                        label: "",
                        actual: "",
                        makingCharge: "",
                      })
                    }
                  >
                    {" "}
                    +
                  </button>
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
