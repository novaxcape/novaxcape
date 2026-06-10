const { Client, Booking, Package, Tourist } = require('../models');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


exports.createBooking = async (req, res, next) => {
    try {
        const clientId = req.user.id;
        const { touristId, packageId } = req.params;
        const { visitDate } = req.body;
        const client = await Client.findByPk(clientId);
        const package = await Package.findByPk(packageId);
        const tourist = await Tourist.findByPk(touristId);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        };

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        };

        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        };

        // Create payment here. use an helper function maintain a clean codebase

        const booking = await Booking.create({
            clientId: client.dataValues.id,
            touristId: tourist.dataValues.id,
            packageId: package.dataValues.id,
            visitDate: dayjs(visitDate, "MM/DD/YYYY").toDate()
        });
        
        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        console.log(error)
        next(error)
    }
};
