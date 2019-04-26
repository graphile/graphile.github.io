import React from "react";

export default function MarketingContributions({ children }) {
  return (
    <div>
      <div
        className="flex"
        style={{
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
}
