import { Vehicle } from "../models/vehicle.model";
import { ApiError } from "../utils/ApiError.js";
import { normalizePlate } from "../utils/normalizePlate.js";

//register vehicle
const createVehicle = async (vehicleData) => {
    const {
        plateNumber,
        ownerName,
        phone,
        vehicleModel,
        vehicleType,
        color,
        registrationYear,
        status,
    } = vehicleData;

    if (
        !plateNumber ||
        !ownerName ||
        !phone ||
        !vehicleModel ||
        !vehicleType ||
        !color ||
        !registrationYear
    ) {
        throw new ApiError(
            400,
            "All vehicle fields are required"
        );
    }

    const normalizedPlate = normalizePlate(plateNumber);

    const existingVehicle = await Vehicle.findOne({
        plateNumber: normalizedPlate,
    });

    if (existingVehicle) {
        throw new ApiError(
            409,
            "Vehicle with this plate number already exists"
        );
    }

    const vehicle = await Vehicle.create({
        plateNumber : normalizePlate,
        ownerName,
        phone,
        vehicleModel,
        vehicleType,
        color,
        registrationYear,
        status,
    });

    return vehicle;
};

//get all vehicles
const getVehicles = async ({
    search,
    status,
    page = 1,
    limit = 10,
}) => {
    const query = {};

    if (search) {
        query.$or = [
            {
                plateNumber: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                ownerName: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    if (status) {
        query.status = status;
    }

    const skip = (page - 1) * limit;

    const [vehicles, totalVehicles] = await Promise.all([
        Vehicle.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),

        Vehicle.countDocuments(query),
    ]);

    return {
        vehicles,
        pagination: {
            currentPage: Number(page),
            limit: Number(limit),
            totalVehicles,
            totalPages: Math.ceil(totalVehicles / limit),
        },
    };
};

//get vehicle by id
const getVehicleById = async (vehicleId) => {
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        throw new ApiError(
            404,
            "Vehicle not found"
        );
    }

    return vehicle;
};

//find vehicle by number plate
const findVehicleByPlate = async (plateNumber) => {
    const normalizedPlate = normalizePlate(plateNumber);

    if (!normalizedPlate) {
        return null;
    }

    return await Vehicle.findOne({
        plateNumber: normalizedPlate,
    });
};

//update vehicle
const updateVehicle = async (vehicleId, updateData) => {
    const normalizedPlate = normalizePlate(plateNumber);
    if (updateData.plateNumber) {
        updateData.plateNumber =
            updateData.normalizedPlate;

        const existingVehicle = await Vehicle.findOne({
            plateNumber: updateData.plateNumber,
            _id: { $ne: vehicleId },
        });

        if (existingVehicle) {
            throw new ApiError(
                409,
                "Another vehicle already uses this plate number"
            );
        }
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
        vehicleId,
        {
            $set: updateData,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!vehicle) {
        throw new ApiError(
            404,
            "Vehicle not found"
        );
    }

    return vehicle;
};

//delete vehicle
const deleteVehicle = async (vehicleId) => {
    const vehicle = await Vehicle.findByIdAndDelete(vehicleId);

    if (!vehicle) {
        throw new ApiError(
            404,
            "Vehicle not found"
        );
    }

    return vehicle;
};

export {
    createVehicle,
    getVehicles,
    getVehicleById,
    findVehicleByPlate,
    updateVehicle,
    deleteVehicle,
};