import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCloth } from "../Context/ClothSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ✅ Fix: accept onClose prop so the Close button actually works
function ClothAddWindow({ onClose }) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      sizes: [
        { label: 20, actual: 105, makingCharge: 50 },
        { label: 22, actual: 105, makingCharge: 50 },
        { label: 24, actual: 105, makingCharge: 50 },
        { label: 26, actual: 105, makingCharge: 50 },
        { label: 28, actual: 105, makingCharge: 50 },
        { label: 30, actual: 105, makingCharge: 50 },
        { label: 32, actual: 105, makingCharge: 50 },
        { label: 34, actual: 105, makingCharge: 50 },
        { label: 36, actual: 105, makingCharge: 50 },
        { label: 38, actual: 105, makingCharge: 50 },
        { label: 40, actual: 105, makingCharge: 50 },
        { label: 42, actual: 105, makingCharge: 50 },
      ],
    },
  });
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "sizes",
  });
  const dispatch = useDispatch();

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

      <label className="field-label">Sizing</label>

      <table className="results-table">
        <thead>
          <tr>
            <th>Size</th>
            <th>Cloth Used</th>
            <th>Making Charge</th>
            <th></th>
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
                  <img src="./public/minus.png" className="h-4 w-3" />
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
                  <img src="./public/add.png" className="h-4 w-12" />
                </button>
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
          onClick={onClose}
          style={{ backgroundColor: "green" }}
        >
          Close
        </div>
      </div>
    </>
  );
}

export default ClothAddWindow;
