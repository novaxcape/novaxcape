exports.autoCapitalizeFirstChar = async (str) => {
    return str.trim().split(' ').map(e=>e[0].toUpperCase() + e.slice(1).toLowerCase()).join(' ')
}