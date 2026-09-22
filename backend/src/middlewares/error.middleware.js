const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";

        errors = Object.values(err.errors).map((error) => ({
            field: error.path,
            message: error.message,
        }));
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 409;

        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];

        message = `${field} '${value}' already exists`;
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
    }

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
};

export { errorMiddleware };