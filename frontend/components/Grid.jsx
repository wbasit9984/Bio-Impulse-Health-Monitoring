import React from "react";
import Toolbar from "./Toolbar";
import Detections from "../scenes/Detections";
import Insights from "../scenes/Insights";
import Analysis from "../scenes/Analysis";
import { useSelector } from "react-redux";

const Grid = () => {
  const currentPage = useSelector((state) => state.currentPage)
  return (
    <div className="relative h-dvh w-[84.5%] overflow-auto">
      <Toolbar />
      {currentPage === "Detections" && <Detections />}
      {currentPage === "Insights" && <Insights />}
      {currentPage === "Analysis" && <Analysis />}
    </div>
  );
};

export default Grid;
