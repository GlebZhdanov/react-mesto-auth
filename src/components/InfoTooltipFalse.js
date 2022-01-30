import InfoTooltip from "./InfoTooltip";
import React from "react";
import imageFalse from "../images/falseImage.svg"

function InfoTooltipFalse (props) {
  return(
    <InfoTooltip isOpen={props.isOpen} onClose={props.onClose}>
      <img src={imageFalse} className="popup__image-true"/>
      <p className="popup__title popup__title_true">Что-то пошло не так!Попробуйте ещё раз.</p>
    </InfoTooltip>
  )
}

export default InfoTooltipFalse;