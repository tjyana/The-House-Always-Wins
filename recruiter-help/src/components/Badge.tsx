import React from "react";

function Badge({ children, classname }: { children: React.ReactNode, classname?: string }) {
  return (
    <div className={"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent " + classname}>
      {children}
    </div>
  );
}

export default Badge;
