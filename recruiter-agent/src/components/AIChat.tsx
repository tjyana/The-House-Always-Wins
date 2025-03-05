"use client";

import React, { useState, FC, ReactNode } from "react";
import { Bot } from "lucide-react";
import { Chat } from "@morph-data/components";

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
        className="bg-white rounded shadow-lg p-6 w-full max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export function AIChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Dialog Trigger */}
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Bot className="mr-2 h-4 w-4" />
        AI Chat
      </Button>

      {/* Modal Dialog */}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <header className="mb-4">
          <h2 className="text-xl font-bold">AI Assistant</h2>
          <p className="text-gray-600">
            Chat with our AI to get insights about candidates and processes.
          </p>
        </header>
        <div className="p-4">
          <Chat postData="chat" height={400} />
        </div>
      </Modal>
    </>
  );
}
