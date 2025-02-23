import React from "react";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full mx-auto ">
      {children}
    </div>
  );
}

export default Card;
