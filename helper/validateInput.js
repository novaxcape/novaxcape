exports.autoCapitalizeFirstChar = async (str) => {
    const name = str.trim().split(' ')

    if (name.length > 1) {
        throw new Error("Please enter only firstname or lastname");
    }

    return name[0][0].toUpperCase() + name[0].slice(1).toLowerCase()
}