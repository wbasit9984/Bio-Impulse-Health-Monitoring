import Detection from "../models/detectionModel.js";
import {io} from "../socket/socket.js"

const metricsToDB = async (req, res) => {
    try {
        const {spO2, bp, bpm, temp, prediction} = req.body
    
        const detection = new Detection({spO2, bp, bpm, temp, prediction})
        await detection.save()

        io.emit("newData")

        res.status(201).json({message: "Successfully submitted metrics", detection: detection})
    } catch (error) {
        res.status(500).json({error: "error in metricsToDB", message: error.message})
    }

}

const getDetections = async (req, res) => {
    try {
        const detections = await Detection.find().sort({ createdAt: -1 });

        if (!detections){
            res.status(400).json({error: "No detections found..."})
        }

        res.status(200).json({message: "Successfully found detections", detections: detections})
    } catch (error) {
        res.status(500).json({error: "error in getDetections", details: error.message})
    }
}

export { metricsToDB, getDetections };