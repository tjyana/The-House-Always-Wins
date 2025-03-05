import React, { FC, ReactNode } from "react";

// Dialog: A container that holds the dialog trigger and content.
// It doesn’t render anything extra by itself; state management is handled externally.
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}
export const Dialog: FC<DialogProps> = ({ children }) => {
  return <>{children}</>;
};

// DialogTrigger: Wraps a clickable element that opens the dialog.
interface DialogTriggerProps {
  children: ReactNode;
  onClick: () => void;
}
export const DialogTrigger: FC<DialogTriggerProps> = ({
  children,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      style={{ display: "inline-block", cursor: "pointer" }}
    >
      {children}
    </span>
  );
};

// DialogContent: The styled container for the dialog's content.
interface DialogContentProps {
  children: ReactNode;
  className?: string;
}
export const DialogContent: FC<DialogContentProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        minWidth: "300px",
      }}
    >
      {children}
    </div>
  );
};

// DialogHeader: Container for header elements inside the dialog.
interface DialogHeaderProps {
  children: ReactNode;
}
export const DialogHeader: FC<DialogHeaderProps> = ({ children }) => {
  return <div style={{ marginBottom: "1rem" }}>{children}</div>;
};

// DialogTitle: The dialog's title.
interface DialogTitleProps {
  children: ReactNode;
}
export const DialogTitle: FC<DialogTitleProps> = ({ children }) => {
  return <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{children}</h2>;
};

// DialogDescription: A short description for the dialog.
interface DialogDescriptionProps {
  children: ReactNode;
}
export const DialogDescription: FC<DialogDescriptionProps> = ({ children }) => {
  return (
    <p style={{ margin: 0, fontSize: "1rem", color: "#666" }}>{children}</p>
  );
};
