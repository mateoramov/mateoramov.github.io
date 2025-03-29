import React, { forwardRef } from "react";

const inactiveClass =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium leading-5 text-slate-500 shadow-sm duration-150 ease-in-out hover:border-slate-300";
const activeClass =
  "inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-500 px-3 py-1 text-sm font-medium leading-5 text-white shadow-sm duration-150 ease-in-out";

const CostomCheckBox = forwardRef(function CostomCheckBox(
  { label, checked, ...props },
  ref
) {
  return (
    <div className="m-1">
      <button
        ref={ref}
        className={checked ? activeClass : inactiveClass}
        {...props}
      >
        {label}
      </button>
    </div>
  );
});

CostomCheckBox.displayName = "CostomCheckBox";

export default CostomCheckBox;