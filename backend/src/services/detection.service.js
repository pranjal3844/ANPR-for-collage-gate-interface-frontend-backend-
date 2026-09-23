import { Detection } from "../models/detection.model.js";
import { ApiError } from "../utils/ApiError.js";
import { normalizePlate } from "../utils/normalizePlate.js";
import { findVehicleByPlate } from "./vehicle.service.js";


const createDetection = async (detectionData) => {

    const {
        plateNumber,
        yoloConfidence = null,
        ocrConfidence = null,
        imageUrl = null,
        detectedAt = new Date(),
        source = "VIDEO_UPLOAD"
    } = detectionData;


    // Validate plate number
    if (!plateNumber) {
        throw new ApiError(400, "Plate number is required");
    }


    // Normalize plate number
    const normalizedPlate = normalizePlate(plateNumber);

    if (!normalizedPlate) {
        throw new ApiError(400, "Invalid plate number");
    }


    // Check whether vehicle exists in registry
    const vehicle = await findVehicleByPlate(normalizedPlate);


    // Determine detection status
    const status = vehicle ? "KNOWN" : "UNKNOWN";


    // Create detection
    const detection = await Detection.create({
        plateNumber: normalizedPlate,
        vehicleId: vehicle ? vehicle._id : null,
        status,
        yoloConfidence,
        ocrConfidence,
        imageUrl,
        detectedAt,
        source
    });


    return detection;
};


const getDetections = async ({
    search,
    status,
    source,
    startDate,
    endDate,
    page = 1,
    limit = 10
}) => {

    const query = {};


    // Search by plate number
    if (search) {
        query.plateNumber = {
            $regex: normalizePlate(search),
            $options: "i"
        };
    }


    // Filter by KNOWN / UNKNOWN
    if (status) {
        query.status = status;
    }


    // Filter by source
    if (source) {
        query.source = source;
    }


    // Date filtering
    if (startDate || endDate) {

        query.detectedAt = {};

        if (startDate) {
            query.detectedAt.$gte = new Date(startDate);
        }

        if (endDate) {
            query.detectedAt.$lte = new Date(endDate);
        }
    }


    const skip = (page - 1) * limit;


    const [detections, totalDetections] = await Promise.all([

        Detection.find(query)
            .populate(
                "vehicleId",
                "plateNumber ownerName phone vehicleModel vehicleType color status"
            )
            .sort({ detectedAt: -1 })
            .skip(skip)
            .limit(Number(limit)),

        Detection.countDocuments(query)

    ]);


    return {
        detections,

        pagination: {
            currentPage: Number(page),
            limit: Number(limit),
            totalDetections,
            totalPages: Math.ceil(totalDetections / limit)
        }
    };
};


const getDetectionById = async (detectionId) => {

    const detection = await Detection.findById(detectionId)
        .populate(
            "vehicleId",
            "plateNumber ownerName phone vehicleModel vehicleType color status"
        );


    if (!detection) {
        throw new ApiError(404, "Detection not found");
    }


    return detection;
};


export {
    createDetection,
    getDetections,
    getDetectionById
};