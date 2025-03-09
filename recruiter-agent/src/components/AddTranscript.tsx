"use client";

import React, { useState, FC, ReactNode } from "react";
import { Bot, UserPlus } from "lucide-react";
import { loadData, postData } from "@morph-data/components";
import axios from "axios";
import Snipper from "./Snipper";
import Progressbar from "./Progressbar";

// A simple Button component with minimal styling
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "default";
}
const Button: FC<ButtonProps> = ({
  variant = "default",
  children,
  ...props
}) => {
  const baseStyle = "px-4 py-2 rounded focus:outline-none";
  const variantStyle =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-blue-500 text-white hover:bg-blue-600";
  return (
    <button className={`${baseStyle} ${variantStyle}`} {...props}>
      {children}
    </button>
  );
};

// A simple Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input: FC<InputProps> = (props) => {
  return <input className="border p-2 rounded" {...props} />;
};

// Modal component using React Portal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow-lg p-6 w-full max-w-[625px]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export function AddTranscript() {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState({});
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate processing steps
    for (let i = 0; i <= 100; i += 25) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(i);
    }
    setIsProcessing(false);
    setOpen(false);
    // transcriptData.run(transcript);
    const res = await axios.post(
      "http://localhost:8080/cli/run/transcript",
      transcript
    );
    console.log(res);
    postData("transcript").run({ transcript: transcript });
  };

  return (
    <>
      {/* Dialog Trigger */}
      <button
        className="p-2 text-sm rounded bg-black text-white"
        onClick={() => setOpen(true)}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add Call Transcript
      </button>

      {/* Modal Dialog */}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <header className="mb-4">
          <h2 className="text-xl font-bold">Add Call Transcript</h2>
          <p className="text-gray-600">
            Paste in the call transcript to create a new task and let AI analyze
            next steps.
          </p>
        </header>
        <div className="grid gap-4 py-4">
          <form method="post">
            {/* Placeholder for chat messages */}
            <textarea
              name="transcript"
              onChange={(e) => {
                setTranscript({ trans: e.target.value });
              }}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[300px] font-mono text-sm"
              placeholder="Paste call transcript here..."
              data-has-listener={true}
            />
            {isProcessing && (
              <div className="flex flex-col gap-2">
                <Progressbar />
                <Snipper />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 rounded text-small bg-white text-black hover:bg-black-600">
                Cancel
              </button>
              <button
                onClick={(e) => handleSubmit(e)}
                className="px-4 py-2 rounded bg-black text-small text-white hover:bg-black-600"
              >
                Process Transcript
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
