"use client";
export function PrintButton() {
  return (
    <button
      type="button"
      className="button button-outline print-button"
      onClick={() => window.print()}
    >
      Print / save as PDF
    </button>
  );
}
