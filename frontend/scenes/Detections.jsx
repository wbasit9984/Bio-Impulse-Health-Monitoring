import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useSocket } from "../context/socketContext";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setDetections, setSelectedData } from "../state/state";

const Detections = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const detections = useSelector((state) => state.detections);

  useEffect(() => {
    getDetections();
  }, []);
  useEffect(() => {
    socket?.on("newData", async () => {
      getDetections();
    });
  }, [socket]);

  const getDetections = async () => {
    try {
      const res = await fetch("https://health-risk-detector-back.onrender.com/api/data/detections", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const detections_found = await res.json();

      if (detections_found.error) {
        return console.log(
          "Error with received detections: ",
          detections_found.error
        );
      }

      dispatch(setDetections({ detections: detections_found }));
      dispatch(setSelectedData({selectedData: detections_found.detections[0]}))
    } catch (error) {
      console.log("Error getting detections: ", error);
    }
  };

  const handleSelectData = (data) => {
    dispatch(setSelectedData({selectedData: data}))
    dispatch(setCurrentPage({currentPage: "Insights"}))
  };
  return (
    <>
      <p className="mt-24 mx-14 text-zinc-900 text-5xl font-medium py-2">Detections</p>
      <div className="border-t border-zinc-900 flex justify-center items-center">
        <div className="border-b border-zinc-900 flex justify-evenly px-[17rem] gap-[5.5rem]">
          <div className="font-bold">SpO2</div>
          <div className="font-bold">BP</div>
          <div className="font-bold">Pulse</div>
          <div className="font-bold">Temp</div>
          <div className="font-bold">Prediction</div>
        </div>
      </div>
      <div className="text-black flex flex-col justify-center items-center gap-3 py-3">
        {detections.detections?.map((data, index) => (
          <div
            className="border bg-linear-to-r from-black to-zinc-700 h-[4rem] w-[70%] flex justify-evenly items-center rounded-full shadow-md"
            key={index}
          >
            <Avatar
              alt="Profile Image"
              src={data.image || `https://i.pravatar.cc/${index*30}`}
              sx={{ width: 45, height: 45 }}
              className="border border-2 border-blue-400"
            />
            <div
              className={`border-b-3 ${
                data.spO2 >= 95 && data.spO2 < 101
                  ? "border-green-600"
                  : data.spO2 >= 90 && data.spO2 < 95
                  ? "border-yellow-600"
                  : "border-red-600"
              } w-[2rem] flex justify-center items-center text-white`}
            >
              {data.spO2}
            </div>
            <div
              className={`border-b-3 ${
                data.bp < 120
                  ? "border-green-600"
                  : (data.bp >= 120 && data.bp <= 129) ||
                    (data.bp >= 130 && data.bp <= 139)
                  ? "border-yellow-600"
                  : "border-red-600"
              } w-[2rem] flex justify-center items-center text-white`}
            >
              {data.bp}
            </div>
            <div
              className={`border-b-3 ${
                data.bpm >= 60 && data.bpm <= 100
                  ? "border-green-600"
                  : (data.bpm >= 50 && data.bpm <= 59) ||
                    (data.bpm >= 101 && data.bpm <= 120)
                  ? "border-yellow-600"
                  : "border-red-600"
              } w-[2rem] flex justify-center items-center text-white`}
            >
              {data.bpm}
            </div>
            <div
              className={`border-b-3 ${
                data.temp <= 37.2
                  ? "border-green-600"
                  : data.temp >= 37.3 && data.temp <= 37.9
                  ? "border-yellow-600"
                  : "border-red-600"
              } w-[2rem] flex justify-center items-center text-white`}
            >
              {Math.round(((data.temp * 9) / 5 + 32) * 10) / 10}
            </div>
            <div
              className={`border h-2rem] ${ data.prediction == "High" ? "border-red-600" : data.prediction == "Med" ? "border-yellow-600" : "border-green-600" } text-blue-100 w-[3rem] flex justify-center items-center rounded-full ${
                data.prediction == "High"
                  ? "bg-[#ff0000]"
                  : data.prediction == "Med"
                  ? "bg-[#FFA500]"
                  : "bg-[#008000]"
              } text-blue-100`}
            >
              {data.prediction}
            </div>
            <button className="border border-blue-400 h-2rem] w-[4rem] rounded-full bg-blue-400 text-blue-100 hover:bg-zinc-900 hover:text-blue-400" onClick={() => (handleSelectData(data))}>
              Details
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Detections;
