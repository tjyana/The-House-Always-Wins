import React from "react";

function Progressbar() {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-gray-600 h-2.5 rounded-full dark:bg-gray-300"
        style={{ width: "45%" }}
      ></div>
    </div>
  );
}

export default Progressbar;
