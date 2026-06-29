import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCloth } from "../Context/ClothSlice";

function ClothAddWindow() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const addHandler = (data) => {
    dispatch(addCloth(data));
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
          type="text"
          placeholder="e.g. 20"
          {...register("labourCharge", { required: true })}
        />
      </div>

      <div className="edit-actions">
        <div
          className="calc-btn flex justify-center"
          onClick={handleSubmit(addHandler)}
        >
          Add Cloth
        </div>
      </div>
    </>
  );
}

export default ClothAddWindow;
