import {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
} from "../services/vehicle.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const create = asyncHandler(async (req, res) => {
    const vehicle = await createVehicle(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                vehicle,
                "Vehicle created successfully"
            )
        );
});

const getAll = asyncHandler(async (req, res) => {
    const {
        search,
        status,
        page = 1,
        limit = 10,
    } = req.query;

    const result = await getVehicles({
        search,
        status,
        page,
        limit,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Vehicles fetched successfully"
            )
        );
});

const getById = asyncHandler(async (req, res) => {
    const vehicle = await getVehicleById(req.params.id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                vehicle,
                "Vehicle fetched successfully"
            )
        );
});

const update = asyncHandler(async (req, res) => {
    const vehicle = await updateVehicle(
        req.params.id,
        req.body
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                vehicle,
                "Vehicle updated successfully"
            )
        );
});

const remove = asyncHandler(async (req, res) => {
    await deleteVehicle(req.params.id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Vehicle deleted successfully"
            )
        );
});

export {
    create,
    getAll,
    getById,
    update,
    remove,
};
