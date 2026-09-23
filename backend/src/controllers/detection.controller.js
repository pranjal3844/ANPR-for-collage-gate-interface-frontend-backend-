import {
    createDetection,
    getDetections,
    getDetectionById
} from "../services/detection.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const create = asyncHandler(async (req, res) => {

    const detection = await createDetection(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                detection,
                "Detection created successfully"
            )
        );
});


const getAll = asyncHandler(async (req, res) => {

    const {
        search,
        status,
        source,
        startDate,
        endDate,
        page = 1,
        limit = 10
    } = req.query;


    const result = await getDetections({
        search,
        status,
        source,
        startDate,
        endDate,
        page,
        limit
    });


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Detections fetched successfully"
            )
        );
});


const getById = asyncHandler(async (req, res) => {

    const detection = await getDetectionById(req.params.id);


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                detection,
                "Detection fetched successfully"
            )
        );
});


export {
    create,
    getAll,
    getById
};