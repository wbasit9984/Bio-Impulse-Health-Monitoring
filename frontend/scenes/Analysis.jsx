import React, { useState } from "react";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
  gaugeClasses,
} from "@mui/x-charts/Gauge";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AirIcon from "@mui/icons-material/Air";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import UmbrellaIcon from "@mui/icons-material/Umbrella";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { weatherCodeLookup } from "../utils/weather_icons";
import { useSelector } from "react-redux";

const GaugePointer = () => {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
};

const dateAxisFormatter = (value, context) =>
  value.toLocaleDateString(undefined, {
    month:
      context.location === "tick"
        ? undefined
        : context.location === "tooltip"
        ? "long"
        : "short",
    dayOfWeek: "numeric",
  });

const xAxis = [
  {
    dataKey: "date",
    scaleType: "time",
    valueFormatter: dateAxisFormatter,
  },
];

const series = [
  {
    dataKey: "value",
    color: "green",
  },
];

const Analysis = () => {
  const detections = useSelector((state) => state.detections);

  const createRiskTrendData = () => {
    let riskData = [];
    let runningCount = 10;
    let detectionsIndexed = detections.detections;
    for (let i = 1; i <= detectionsIndexed.length; i++) {
      let dataset = {};
      dataset["date"] = new Date(
        detectionsIndexed[detectionsIndexed.length - i].createdAt.slice(0, 10)
      );
      if (
        detectionsIndexed[detectionsIndexed.length - i].prediction === "Low"
      ) {
        runningCount = runningCount - 2;
        dataset["value"] = runningCount;
      } else if (
        detectionsIndexed[detectionsIndexed.length - i].prediction === "Med"
      ) {
        runningCount = runningCount - 1;
        dataset["value"] = runningCount;
      } else {
        runningCount = runningCount + 3;
        dataset["value"] = runningCount;
      }
      riskData.push(dataset);
    }

    return riskData;
  };

  const [riskTrendData, setRiskTrendData] = useState(createRiskTrendData);
  const lastDate = riskTrendData[riskTrendData.length - 1].date;
  const paddedMax = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);

  const calc_overall_risk = () => {
    let other = 0;

    for (const detection of detections.detections) {
      if (detection.prediction != "Low") {
        other++;
      }
    }

    return Math.round((other / detections.detections.length) * 100);
  };

  const [overallRisk, setOverallRisk] = useState(calc_overall_risk);

  const [overallRiskLabel, setRiskLabel] = useState(() => {
    if (overallRisk <= 33) {
      return "Low";
    } else if (overallRisk > 33 && overallRisk <= 66) {
      return "Medium";
    }
    return "High";
  });

  const handleArcColor = () => {
    if (overallRisk <= 33) {
      return "green";
    } else if (overallRisk > 33 && overallRisk <= 66) {
      return "orange";
    }
    return "red";
  };

  const calcChartCategoriesValues = (category) => {
    let count = 0;
    for (const detection of detections.detections) {
      if (detection.prediction == category) {
        count++;
      }
    }
    return count;
  };

  const getWeatherForcast = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.weather.gov/points/${latitude},${longitude}`
          );
          const govLocationData = await res.json();
          const res2 = await fetch(govLocationData.properties.forecast);
          const govForecastData = await res2.json();
          const openweatherkey = import.meta.env.VITE_OPEN_WEATHER_API;
          const res3 = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly&appid=${openweatherkey}`
          );
          const openWeatherData = await res3.json();
          setForcast({
            gov: govForecastData.properties,
            openweather: openWeatherData,
          });
        },
        (error) => {
          console.error("Error code: " + error.code + " - " + error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  const [forcast, setForcast] = useState(getWeatherForcast);

  console.log(forcast);

  return (
    <>
      <p className="mt-24 mx-14 text-zinc-900 text-5xl font-medium py-2">Environment Analysis</p>
      <div className="border-t border-zinc-900 flex justify-center items-center"></div>
      <section className="w-full h-full px-36">
        <section className="h-[25%] w-full grid grid-cols-6 gap-10 mt-7">
          <div className="border border-black col-span-2 rounded-lg shadow-md">
            <div className="bg-linear-to-r from-black to-zinc-700 h-full w-full flex flex-col justify-center items-center relative rounded-lg shadow-xl">
              <h2
                className={`absolute top-3 ${
                  overallRiskLabel == "Low"
                    ? "text-green-500"
                    : overallRiskLabel == "Medium"
                    ? "text-orange-500"
                    : "text-red-500"
                }`}
              >
                {overallRiskLabel} Risk
              </h2>
              <GaugeContainer
                width={200}
                height={200}
                startAngle={-110}
                endAngle={110}
                value={overallRisk}
                sx={{
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: handleArcColor, // Green color for the value arc
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: "#e0e0e0", // Light gray color for the reference arc
                  },
                }}
              >
                <GaugeReferenceArc />
                <GaugeValueArc />
                <GaugePointer />
              </GaugeContainer>
            </div>
          </div>
          <div className="bg-linear-to-r from-black to-zinc-700 col-span-2 rounded-lg shadow-xl">
            <div className="h-full w-full flex justify-center items-center">
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: calcChartCategoriesValues("Low"),
                        label: `Low Risk`,
                        color: "green",
                      },
                      {
                        id: 1,
                        value: calcChartCategoriesValues("Med"),
                        label: `Medium Risk`,
                        color: "orange",
                      },
                      {
                        id: 2,
                        value: calcChartCategoriesValues("High"),
                        label: `High Risk`,
                        color: "red",
                      },
                    ],
                  },
                ]}
                sx={{
                  "& div": { color: "#63b3ed", fontWeight: "bold" },
                }}
                width={200}
                height={200}
              />
            </div>
          </div>
          <div className="bg-linear-to-r from-black to-zinc-700 col-span-2 rounded-lg shadow-xl">
            <div className="h-full w-full flex justify-center items-center">
              <BarChart
                xAxis={[
                  {
                    data: ["Low Risk", "Medium Risk", "High Risk"],
                    colorMap: {
                      type: "ordinal",
                      values: ["Low Risk", "Medium Risk", "High Risk"],
                      colors: ["green", "orange", "red"], // Specific color for each bar
                    },
                  },
                ]}
                series={[
                  {
                    data: [
                      calcChartCategoriesValues("Low"),
                      calcChartCategoriesValues("Med"),
                      calcChartCategoriesValues("High"),
                    ],
                  },
                ]}
                sx={{
                  "& div": { fill: "#63b3ed", stroke: "#63b3ed" },
                  "& tspan": { fill: "#63b3ed", stroke: "#63b3ed" },
                  "& .MuiChartsAxis-line": {
                    stroke: "#63b3ed",
                    strokeWidth: 1,
                  },
                  // Small tick marks
                  "& .MuiChartsAxis-tick": {
                    stroke: "#63b3ed",
                  },
                }}
                height={200}
              />
            </div>
          </div>
        </section>
        <section className="h-[60%] w-full flex justify-center items-center gap-10 mt-7">
          <div className="h-full w-full grid grid-cols-4 gap-10">
            <div className="bg-linear-to-r from-black to-zinc-700 col-span-4 rounded-lg shadow-xl">
              <div className="h-full w-full flex flex-col justify-center items-center">
                <p className="mt-7 text-[#63b3ed] font-bold">Risk Score OT</p>
                <LineChart
                  dataset={riskTrendData}
                  xAxis={[
                    {
                      dataKey: "date",
                      scaleType: "time",
                      valueFormatter: dateAxisFormatter,
                      max: paddedMax,
                    },
                  ]}
                  series={series}
                  sx={{
                    "& div": { fill: "#63b3ed", stroke: "#63b3ed" },
                    "& tspan": { fill: "#63b3ed", stroke: "#63b3ed" },
                    "& .MuiChartsAxis-line": {
                      stroke: "#63b3ed",
                      strokeWidth: 1,
                    },
                    // Small tick marks
                    "& .MuiChartsAxis-tick": {
                      stroke: "#63b3ed",
                    },
                  }}
                  height={300}
                  width={600}
                  margin={{ right: 50 }}
                  grid={{ vertical: true, horizontal: true }}
                />
              </div>
            </div>
            <div className="col-span-4 rounded-lg">
              <div className="h-full w-full flex justify-between gap-5">
                <div className="bg-linear-to-r from-black to-zinc-700 w-[33%] rounded-lg flex flex-col justify-evenly items-center shadow-xl">
                  <div className="px-3 mt-2">
                    <p className="text-[#63b3ed]">Change</p>
                  </div>
                  <div className="flex justify-end items-center gap-2 px-5">
                    <p className="text-[#008000] text-5xl font-semibold">
                      {riskTrendData[riskTrendData.length - 1].value <
                      riskTrendData[riskTrendData.length - 2].value
                        ? riskTrendData[riskTrendData.length - 2].value -
                          riskTrendData[riskTrendData.length - 1].value
                        : riskTrendData[riskTrendData.length - 1].value -
                          riskTrendData[riskTrendData.length - 2].value}
                    </p>
                    <ArrowDownwardIcon
                      sx={{ color: "green", height: 50, width: 50 }}
                    />
                  </div>
                </div>
                <div className="bg-linear-to-r from-black to-zinc-700 w-[33%] rounded-lg flex flex-col justify-evenly items-center shadow-xl">
                  <div className="px-3 mt-2">
                    <p className="text-[#63b3ed]">Highest</p>
                  </div>
                  <div className="flex justify-evenly items-center gap-2 px-5">
                    <SentimentVeryDissatisfiedIcon
                      sx={{ color: "red", height: 50, width: 50 }}
                    />
                    <p className="text-[#ff0000] text-5xl font-semibold">
                      {Math.max(...riskTrendData.map((o) => o.value))}
                    </p>
                  </div>
                </div>
                <div className="bg-linear-to-r from-black to-zinc-700 w-[33%] rounded-lg flex flex-col justify-evenly items-center shadow-xl">
                  <div className="px-3 mt-2">
                    <p className="text-[#63b3ed]">Lowest</p>
                  </div>
                  <div className="flex justify-evenly items-center gap-2 px-5">
                    <SentimentSatisfiedAltIcon
                      sx={{ color: "green", height: 50, width: 50 }}
                    />
                    <p className="text-[#008000] text-5xl font-semibold">
                      {Math.min(...riskTrendData.map((o) => o.value))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-r from-black to-zinc-700 h-full w-full grid grid-cols-4 gap-10 shadow-md rounded-lg">
            <div className="col-span-4 rounded-lg pt-5">
              <div className="h-[10%] flex justify-center">
                <p className="text-[#63b3ed] font-bold ">Weather Forcast</p>
              </div>
              <div className="bg-linear-to-r from-cyan-500 to-blue-500 h-[65%] flex flex-col justify-center items-center mx-20 rounded-lg">
                <div className="w-full px-[5.5rem]">
                  <p className="text-white font-bold text-lg">Today</p>
                </div>
                <div className="w-full flex">
                  <div className="w-[60%] flex flex-col justify-begin items-center relative">
                    <p className="absolute text-white text-sm px-4 text-center bottom-3 font-semibold">{forcast?.gov.periods[0].shortForecast}</p>
                    <img
                      src={weatherCodeLookup[forcast?.openweather.current.weather[0].id]}
                      alt=""
                      className="size-48"
                    />
                  </div>
                  <div className="border-l border-zinc-900 w-[40%] flex flex-col gap-1">
                    <div className="flex justify-center items-center gap-1 pt-1">
                      <button className="border border-black bg-zinc-900 px-2 text-sm rounded-full text-white">
                        Today
                      </button>
                      <button className="border border-black bg-zinc-900 px-2 text-sm rounded-full text-white">
                        Tonight
                      </button>
                    </div>
                    <div className="mx-3 h-[90%] py-2 flex flex-col justify-center items-center gap-1">
                      <div className="border border-black bg-linear-to-r from-black to-zinc-700 h-[33%] w-[60%] flex flex-col rounded-lg">
                        <p className="text-sm text-white pl-2">Temp</p>
                        <p className="flex justify-end text-lg text-cyan-400 pr-3">
                          {`${Math.round(forcast?.openweather.current.temp)}°`}
                        </p>
                      </div>
                      <div className="border border-black bg-linear-to-r from-black to-zinc-700 h-[33%] w-[60%] rounded-lg">
                        <p className="text-sm text-white pl-2">Hi</p>
                        <p className="flex justify-end text-lg text-cyan-400 pr-3">
                          {`${Math.round(forcast?.openweather.daily[0].temp.max)}°`}
                        </p>
                      </div>
                      <div className="border border-black bg-linear-to-r from-black to-zinc-700 h-[33%] w-[60%] rounded-lg">
                        <p className="text-sm text-white pl-2">Low</p>
                        <p className="flex justify-end text-lg text-cyan-400 pr-3">
                        {`${Math.round(forcast?.openweather.daily[0].temp.min)}°`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-zinc-900 h-full w-full flex justify-evenly items-center">
                  <div className="border border-black bg-linear-to-r from-black to-zinc-700 h-[85%] w-[20%] flex flex-col justify-center items-center rounded-lg">
                    <AirIcon className="text-blue-400" />
                    <p className="text-xs text-cyan-400">{forcast?.gov.periods[0].windSpeed}</p>
                    <p className="text-xs text-white">Wind</p>
                  </div>
                  <div className="border border-black bg-linear-to-r from-black to-zinc-700 h-[85%] w-[20%] flex flex-col justify-center items-center rounded-lg">
                    <WaterDropIcon className="text-blue-400" />
                    <p className="text-xs text-cyan-400">{`${Math.round(forcast?.openweather.current.humidity)}%`}</p>
                    <p className="text-xs text-white">Humidity</p>
                  </div>
                  <div className="border border-black bg-linear-to-r from-black to-zinc-700 h-[85%] w-[20%] flex flex-col justify-center items-center rounded-lg">
                    <UmbrellaIcon className="text-blue-400" />
                    <p className="text-xs text-cyan-400">{`${Math.round(forcast?.openweather.daily[0].pop) * 100}%`}</p>
                    <p className="text-xs text-white">Rain</p>
                  </div>
                </div>
              </div>
              <div className="h-[25%] flex justify-evenly items-center py-3 px-6">
                <div className="bg-linear-to-r from-cyan-500 to-blue-500 h-full w-[15%] flex flex-col justify-center items-center rounded-lg">
                  <p className="font-bold text-white">{forcast?.gov.periods[2].name}</p>
                  <div>
                    <img
                      src={weatherCodeLookup[forcast?.openweather.daily[1].weather[0].id]}
                      alt=""
                      className="size-10"
                    />
                  </div>
                  <p className="font-bold text-white">{`${Math.round(forcast?.openweather.daily[1].temp.day)}°`}</p>
                </div>
                <div className="bg-linear-to-r from-cyan-500 to-blue-500 h-full w-[15%] flex flex-col justify-center items-center rounded-lg">
                  <p className="font-bold text-white">{forcast?.gov.periods[4].name}</p>
                  <div>
                    <img
                      src={weatherCodeLookup[forcast?.openweather.daily[2].weather[0].id]}
                      alt=""
                      className="size-10"
                    />
                  </div>
                  <p className="font-bold text-white">{`${Math.round(forcast?.openweather.daily[2].temp.day)}°`}</p>
                </div>
                <div className="bg-linear-to-r from-cyan-500 to-blue-500 h-full w-[15%] flex flex-col justify-center items-center rounded-lg">
                  <p className="font-bold text-white">{forcast?.gov.periods[6].name}</p>
                  <div>
                    <img
                      src={weatherCodeLookup[forcast?.openweather.daily[3].weather[0].id]}
                      alt=""
                      className="size-10"
                    />
                  </div>
                  <p className="font-bold text-white">{`${Math.round(forcast?.openweather.daily[3].temp.day)}°`}</p>
                </div>
                <div className="bg-linear-to-r from-cyan-500 to-blue-500 h-full w-[15%] flex flex-col justify-center items-center rounded-lg">
                  <p className="font-bold text-white">{forcast?.gov.periods[8].name}</p>
                  <div>
                    <img
                      src={weatherCodeLookup[forcast?.openweather.daily[4].weather[0].id]}
                      alt=""
                      className="size-10"
                    />
                  </div>
                  <p className="font-bold text-white">{`${Math.round(forcast?.openweather.daily[4].temp.day)}°`}</p>
                </div>
                <div className="bg-linear-to-r from-cyan-500 to-blue-500 h-full w-[15%] flex flex-col justify-center items-center rounded-lg">
                  <p className="font-bold text-white">{forcast?.gov.periods[10].name}</p>
                  <div>
                    <img
                      src={weatherCodeLookup[forcast?.openweather.daily[5].weather[0].id]}
                      alt=""
                      className="size-10"
                    />
                  </div>
                  <p className="font-bold text-white">{`${Math.round(forcast?.openweather.daily[5].temp.day)}°`}</p>
                </div>
                <div className="bg-linear-to-r from-cyan-500 to-blue-500 h-full w-[15%] flex flex-col justify-center items-center rounded-lg">
                  <p className="font-bold text-white">{forcast?.gov.periods[12].name}</p>
                  <div>
                    <img
                      src={weatherCodeLookup[forcast?.openweather.daily[6].weather[0].id]}
                      alt=""
                      className="size-10"
                    />
                  </div>
                  <p className="font-bold text-white">{`${Math.round(forcast?.openweather.daily[6].temp.day)}°`}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};
export default Analysis;
