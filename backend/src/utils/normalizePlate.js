const normalizePlate = (plateNumber) => {
    if (!plateNumber) {
        return null;
    }

    return plateNumber
        .toString()
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
};

export { normalizePlate };