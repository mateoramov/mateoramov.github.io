import React, { forwardRef } from "react";

const Button = forwardRef(function Button(
  { label, className, isBgColor, ...props },
  ref
) {
  const baseClasses = `px-6 py-[6px] text-sm font-medium rounded active:text-violet-500 hover:focus:outline-none disabled:cursor-not-allowed ${className || ""}`;

  const bgColorClasses = isBgColor
    ? `text-white bg-violet-600 border border-violet-600 hover:bg-transparent hover:text-violet-600`
    : `text-violet-600 bg-white border border-violet-600 hover:bg-violet-600 hover:text-white`;

  return (
    <button ref={ref} className={`${baseClasses} ${bgColorClasses}`} {...props}>
      {label}
    </button>
  );
});

Button.displayName = "Button";

export default Button;