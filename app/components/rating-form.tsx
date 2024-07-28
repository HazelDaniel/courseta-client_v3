import { Form } from "@remix-run/react";
import { ChangeEvent, useEffect, useState } from "react";
import "~/styles/rating-form.css";

// handle
const handleCheck: (
  e: ChangeEvent<HTMLInputElement>,
  fn: React.Dispatch<React.SetStateAction<number>>,
  pos: number
) => void = (e, fn, pos) => {
  if ((e.currentTarget as HTMLInputElement).checked) {
    fn(pos);
  } else {
    fn(0);
  }
};

export const RatingForm: React.FC<{
  variant: "view" | "edit";
  value?: number;
  namespace?: string;
}> = ({ variant, value, namespace }) => {
  const [currentPicked, setCurrentPicked] = useState(0);
  if (variant === "view") {
    return (
      <div className={`rating${` ${variant}`}`}>
        <input
          type="checkbox"
          id={`star5-${namespace}`}
          value="5"
          checked={Math.round(value || 0) === 5}
          readOnly
        />
        <label htmlFor={`star5-${namespace}`}>★</label>
        <input
          type="checkbox"
          id={`star4-${namespace}`}
          value="4"
          checked={Math.round(value || 0) === 4}
          readOnly
        />
        <label htmlFor={`star4-${namespace}`}>★</label>
        <input
          type="checkbox"
          id={`star3-${namespace}`}
          value="3"
          checked={Math.round(value || 0) === 3}
          readOnly
        />
        <label htmlFor={`star3-${namespace}`}>★</label>
        <input
          type="checkbox"
          id={`star2-${namespace}`}
          value="2"
          checked={Math.round(value || 0) === 2}
          readOnly
        />
        <label htmlFor={`star2-${namespace}`}>★</label>
        <input
          type="checkbox"
          id={`star1-${namespace}`}
          value="1"
          checked={Math.round(value || 0) === 1}
          readOnly
        />
        <label htmlFor={`star1-${namespace}`}>★</label>
      </div>
    );
  }
  return (
    <Form className="rating">
      <input
        type="checkbox"
        id="star5"
        name="rating"
        value="5"
        checked={currentPicked === 5}
        onChange={(e) => handleCheck(e, setCurrentPicked, 5)}
      />
      <label htmlFor="star5">★</label>
      <input
        type="checkbox"
        id="star4"
        name="rating"
        value="4"
        checked={currentPicked === 4}
        onChange={(e) => handleCheck(e, setCurrentPicked, 4)}
      />
      <label htmlFor="star4">★</label>
      <input
        type="checkbox"
        id="star3"
        name="rating"
        value="3"
        checked={currentPicked === 3}
        onChange={(e) => handleCheck(e, setCurrentPicked, 3)}
      />
      <label htmlFor="star3">★</label>
      <input
        type="checkbox"
        id="star2"
        name="rating"
        value="2"
        checked={currentPicked === 2}
        onChange={(e) => handleCheck(e, setCurrentPicked, 2)}
      />
      <label htmlFor="star2">★</label>
      <input
        type="checkbox"
        id="star1"
        name="rating"
        value="1"
        checked={currentPicked === 1}
        onChange={(e) => handleCheck(e, setCurrentPicked, 1)}
      />
      <label htmlFor="star1">★</label>
    </Form>
  );
};
