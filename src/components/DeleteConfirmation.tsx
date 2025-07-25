'use client';

import React from 'react';

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}


function DeleteConfirmationComponent({
  open,
  onClose,
  onConfirm,
  message = "Are you sure you want to delete?",
}: DeleteConfirmationProps) {
 
  if (!open) return null;
 console.log('DeleteConfirmation render');
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1500,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ef4444",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const DeleteConfirmation = React.memo(DeleteConfirmationComponent);

export default DeleteConfirmation;
