import React from "react";

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pt-0 space-y-6 mt-4">{children}</div>;
}

export default CardContent;
