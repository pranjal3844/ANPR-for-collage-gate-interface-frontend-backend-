import { Vehicle } from "../models/vehicle.model";
import { ApiError } from "../utils/ApiError.js";

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

    const existingVehicle = await Vehicle.findOne({
        plateNumber: plateNumber.toUpperCase().trim(),
    });

    if (existingVehicle) {
        throw new ApiError(
            409,
            "Vehicle with this plate number already exists"
        );
    }

    const vehicle = await Vehicle.create({
        plateNumber,
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
    if (!plateNumber) {
        return null;
    }

    const vehicle = await Vehicle.findOne({
        plateNumber: plateNumber.trim().toUpperCase(),
    });

    return vehicle;
};

//update vehicle
const updateVehicle = async (vehicleId, updateData) => {
    if (updateData.plateNumber) {
        updateData.plateNumber =
            updateData.plateNumber.trim().toUpperCase();

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