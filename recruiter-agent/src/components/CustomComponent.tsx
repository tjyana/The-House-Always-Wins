// src/components/CustomComponent.tsx
import React from "react";
import { useState } from "react";
import { loadData } from "@morph-data/components";

const metrics = loadData("example_dataframe", "json"); // specify the alias and the format

export const LoadDataComp = () => {
  return (
    <div>
      <h1>Metrics</h1>
      <pre>{JSON.stringify(metrics, null, 2)}</pre>
    </div>
  );
};

// const execBatch = postData("example_batch_process");

export const CustomComponent: React.FC = () => {
  return (
    <div>
      <h1>Custom Component</h1>
    </div>
  );
};
