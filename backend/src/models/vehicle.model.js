import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
    {
        plateNumber: {

        },
        ownerName: {

        },
        phone: {

        },
        vehicleModel: {

        },
        vehicleType: {
            
        },
        color: {

        },
        registerationYear
        
    },{timestamps: true}
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);