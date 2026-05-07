import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { RadarChart } from "@mui/x-charts/RadarChart";
import Avatar from "@mui/material/Avatar";

const Insights = () => {
  const chatBotConvoMessages = useState([
    {
      message: "Hello, how can i assist you?",
      sender: "Agent",
    },
  ]);



  const selectedData = useSelector((state) => state.selectedData);
  const settings_SPO2 = {
    width: 200,
    height: 200,
    value: selectedData.spO2,
    valueMax: 101,
  };
  const settings_BP = {
    width: 200,
    height: 200,
    value: selectedData.bp,
    valueMax: 140,
  };
  const settings_BPM = {
    width: 200,
    height: 200,
    value: selectedData.bpm,
    valueMax: 120,
  };
  const settings_TEMP = {
    width: 200,
    height: 200,
    value:
      Math.floor(Math.round(((selectedData.temp * 9) / 5 + 32) * 10) / 10) ||
      null,
    valueMax: 101,
  };

  const handleColor = () => {
    if (selectedData.prediction == "Low" || selectedData.prediction == "Norm") {
      return "#008000";
    } else if (selectedData.prediction == "Med") {
      return "#FFA500";
    } else {
      return "#ff0000";
    }
  };

  const handleGaugeColor = (metric) => {
    let color;
    if (metric == "spO2") {
      if (selectedData.spO2 >= 95 && selectedData.spO2 < 101) {
        return (color = "#008000");
      } else if (selectedData.spO2 >= 90 && selectedData.spO2 < 95) {
        return (color = "#FFA500");
      } else {
        return (color = "#ff0000");
      }
    } else if (metric == "bp") {
      if (selectedData.bp < 120) {
        return (color = "#008000");
      } else if (
        (selectedData.bp >= 120 && selectedData.bp <= 129) ||
        (selectedData.bp >= 130 && selectedData.bp <= 139)
      ) {
        return (color = "#FFA500");
      } else {
        return (color = "#ff0000");
      }
    } else if (metric == "bpm") {
      if (selectedData.bpm >= 60 && selectedData.bpm <= 100) {
        return (color = "#008000");
      } else if (
        (selectedData.bpm >= 50 && selectedData.bpm <= 59) ||
        (selectedData.bpm >= 101 && selectedData.bpm <= 120)
      ) {
        return (color = "#FFA500");
      } else {
        return (color = "#ff0000");
      }
    } else if (metric == "temp") {
      if (selectedData.temp <= 37.2) {
        return (color = "#008000");
      } else if (selectedData.temp >= 37.3 && selectedData.temp <= 37.9) {
        return (color = "#FFA500");
      } else {
        return (color = "#ff0000");
      }
    }
  };
  return (
    <>
      <p className="mt-24 mx-14 text-zinc-900 text-5xl font-medium py-2">
        Insights
      </p>
      <div className="border-t border-zinc-900 flex justify-center items-center"></div>
      <section className="w-full h-full flex flex-col justify-center items-center gap-5 mt-7">
        <div className="w-[80%] h-full grid grid-cols-6 gap-10">
          <div className="col-span-2 h-full rounded-lg">
            <div className="h-full flex justify-center items-center">
              <Avatar
                alt="Profile Image"
                src={
                  "https://res.cloudinary.com/dmnspicpk/image/upload/v1696703190/j63wacjgghegspisfzta.jpg"
                }
                sx={{ width: 400, height: 400 }}
                className="border border-2 border-blue-400 shadow-sm shadow-cyan-300"
              />
            </div>
          </div>
          <div className="bg-white col-span-4 size-30 rounded-xl shadow-md">
            <div className="bg-linear-to-r from-black to-zinc-700 rounded-xl h-full w-full flex justify-evenly items-center pr-4 gap-6 relative">
              <div className="h-full w-full flex justify-center items-center gap-3 px-4 rounded-l-xl">
                <div className="flex flex-col gap-3">
                  <div className="relative bg-linear-to-r from-black to-blue-400 rounded-full">
                    <p className="absolute text-sm top-[3rem] right-[3rem] text-white">
                      Oxygen Sat.
                    </p>
                    <Gauge
                      {...settings_SPO2}
                      cornerRadius="50%"
                      sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                          "& tspan": { fill: "white" }, // Target the text span if it exists
                          fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: handleGaugeColor("spO2"),
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                          fill: theme.palette.text.disabled,
                        },
                      })}
                    />
                  </div>
                  <div className="relative bg-linear-to-r from-black to-blue-400  rounded-full">
                    <p className="absolute text-sm top-[3rem] right-[2.5rem] text-white">
                      Beats Per Min.
                    </p>
                    <Gauge
                      {...settings_BPM}
                      cornerRadius="50%"
                      sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                          "& tspan": { fill: "white" },
                          fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: handleGaugeColor("bpm"),
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                          fill: theme.palette.text.disabled,
                        },
                      })}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="relative bg-linear-to-r from-black to-blue-400  rounded-full">
                    <p className="absolute text-sm top-[3rem] right-[2.5rem] text-white">
                      Blood Pressure
                    </p>
                    <Gauge
                      {...settings_BP}
                      cornerRadius="50%"
                      sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                          "& tspan": { fill: "white" },
                          fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: handleGaugeColor("bp"),
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                          fill: theme.palette.text.disabled,
                        },
                      })}
                    />
                  </div>
                  <div className="relative bg-linear-to-r from-black to-blue-400  rounded-full">
                    <p className="absolute text-sm top-[3rem] right-[3rem] text-white">
                      Temperature
                    </p>
                    <Gauge
                      {...settings_TEMP}
                      cornerRadius="50%"
                      sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                          "& tspan": { fill: "white" },
                          fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: handleGaugeColor("temp"),
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                          fill: theme.palette.text.disabled,
                        },
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className="relative flex justify-center items-center w-full h-[80%]">
                <p className="absolute top-[-1rem] right-[6rem] text-blue-400 px-4 font-bold">
                  Prediction
                </p>
                <RadarChart
                  height={300}
                  series={[
                    {
                      label: `${selectedData.prediction} Risk`,
                      data: [
                        selectedData.spO2,
                        selectedData.bp,
                        selectedData.bpm,
                        Math.round(((selectedData.temp * 9) / 5 + 32) * 10) /
                          10,
                      ],
                      color: handleColor(),
                      fillArea: true,
                    },
                  ]}
                  radar={{
                    max: 140,
                    metrics: ["SpO2", "BP", "BPM", "Temp"],
                  }}
                  sx={{
                    "& div": { color: handleColor, fontWeight: "bold" },
                    "& tspan": { fill: "#63b3ed", stroke: "#63b3ed" },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-xl w-[80%] h-full grid grid-cols-6 gap-10">
          <div className="bg-linear-to-r from-black to-zinc-700 col-span-6 size-30 rounded-xl shadow-md">
            <div className="w-full h-full flex">
              <div className="border-r border-white w-full h-full">
                <div className="w-full flex justify-center py-10">
                  <div className="border border-blue-400 px-2 py-1 rounded-full bg-blue-600 text-white">Generate</div>
                </div>
              </div>
              <div className="border-l border-white w-full">
                <div className="border border-white h-[12%] flex flex-col justify-start px-5">
                  <p className="text-blue-400">AI Assistant</p>
                  <p className="text-xs text-zinc-400">Ask about the metrics</p>
                </div>
                <div className="border border-white h-[73%]"></div>
                <div className="border border-white h-[15%]">Input</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Insights;
