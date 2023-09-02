import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import "../pages/Agroquimicos/style.css";
library.add(fab, fas, far);

export const Modal = ({
  children,
  isOpen,
  closeModal,
  title,
  btn_text,
  handlePress,
}) => {
  const handleModalContainerClick = (e) => e.stopPropagation();
  return (
    <div className={`modal ${isOpen && "is-open"}`} onClick={closeModal}>
      <div
        className="modal-container"
        onClick={(e) => handleModalContainerClick(e)}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={closeModal}>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <hr />
        <div className="modal-body">{children}</div>
        <hr />
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={closeModal}>
            Cancelar
          </button>
          <button onClick={handlePress} className="btn btn-success">
            {btn_text}
          </button>
        </div>
      </div>
    </div>
  );
};
