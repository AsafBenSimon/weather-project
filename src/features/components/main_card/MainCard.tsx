import React, { useState } from "react";
import "./MainCard.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  changeMeasurementUnit,
  selectIsMetric,
  selectMeasurementIcon,
  selectTemperature,
} from "../../../redux-state-manager/CurrentConditions/currentConditionsSlice";
import { MeasurementUnits } from "../../../Enums/Measurements";

const MainCard: React.FC = () => {
  const isMetricMeasurement = useAppSelector(selectIsMetric);
  const currentTemperature = useAppSelector(selectTemperature);
  const cardTemperatureIcon: MeasurementUnits = useAppSelector(() =>
    selectMeasurementIcon(isMetricMeasurement)
  );
  const buttonTemperatureIcon: MeasurementUnits = useAppSelector(() =>
    selectMeasurementIcon(!isMetricMeasurement)
  );
  const dispatch = useAppDispatch();

  const toggleTemperatureUnit = () => {
    dispatch(changeMeasurementUnit());
  };

  return (
    <div className="MainCard-Container">
      <div className="MainCard">
        <div className="Temperature-Changer">
          <button
            className="Temperature-Button"
            onClick={toggleTemperatureUnit}
          >
            {buttonTemperatureIcon}
          </button>
        </div>
        <div className="temps-Container">
          <h2>
            {currentTemperature} {cardTemperatureIcon}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
