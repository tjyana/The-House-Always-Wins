import React from "react";

function Textarea({ children }: { children: React.ReactNode }) {
  return (
    <textarea className="flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 border-green-200 bg-green-50">
      {children}
    </textarea>
  );
}

export default Textarea;
