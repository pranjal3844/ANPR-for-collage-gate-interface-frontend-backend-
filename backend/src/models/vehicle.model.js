import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
    {
        plateNumber: {
            type: String,
            required: [true,"Plate number is required"],
            unique: true,
            trim : true,
            uppercase: true,
            index: true
        },
        ownerName: {
            type: String,
            required: [true,"Owner name is required"],
            trim: true
        },
        phone: {
            type: String,
            required: [true,"phone number is required"],
            trim: true
        },
        vehicleModel: {
            type: String,
            required: [true,"Vehicle model is required"],
            trim: true
        },
        vehicleType: {
            type: String,
            required: [true,"Vehicle type is required"],
            trim: true
        },
        color: {
            type: String,
            required: [true,"Color is required"],
            trim: true
        },
        registrationYear: {
            type: Number,
            required: [true,"Registration year is required"],
            min: [1900,"invalid registration year"],
            max: [new Date().getFullYear(),"Registration year cannot be in the future"]
        },
        status: {
            type: String,
            enum: ["AUTHORIZED", "UNAUTHORIZED"],
            default: "UNAUTHORIZED"
        }
        
    },{timestamps: true}
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);