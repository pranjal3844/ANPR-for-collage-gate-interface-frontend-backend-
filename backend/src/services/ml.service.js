import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

const processVideoWithML = async (videoPath) => {

    if (!videoPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!process.env.ML_SERVICE_URL) {
        throw new ApiError(500, "ML service URL is not configured");
    }

    try {

        const response = await axios.post(
            `${process.env.ML_SERVICE_URL}/process-video`,
            {
                videoPath
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "ML Service Error:",
            error.response?.data || error.message
        );

        throw new ApiError(
            502,
            "Unable to communicate with ML service"
        );
    }
};

export {
    processVideoWithML
};