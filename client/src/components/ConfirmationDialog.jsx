import React from "react";

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-dialog">
      <p>{message}</p>
      <div className="buttons">
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
