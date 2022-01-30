import InfoTooltip from "./InfoTooltip";
import React from "react";
import imageTrue from "../images/trueImage.svg"

function InfoTooltipTrue (props) {
  return(
    <InfoTooltip isOpen={props.isOpen} onClose={props.onClose}>
      <img src={imageTrue} className="popup__image-true"/>
      <p className="popup__title popup__title_true">Вы успешно зарегистрировались!</p>
    </InfoTooltip>
  )
}

export default InfoTooltipTrue;