import React from "react";

function InfoTooltip(props) {
  return (
    <div className={`popup ${ props.isOpen ? "popup_opened" : "" }`}
    >
      <div className="popup__form">
          {props.children}
        <button onClick={props.onClose} type="button" className="popup__buttom-close" />
      </div>
    </div>
  )}

export default InfoTooltip;