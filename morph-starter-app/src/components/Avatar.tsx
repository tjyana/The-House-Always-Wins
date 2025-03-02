import React from "react";

function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
      {children}
    </span>
  );
}

export default Avatar;
