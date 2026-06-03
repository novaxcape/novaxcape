const { Package } = require('../models');


exports.createPackage = async (req, res) => {
    try {
        const {
            packageName,
            packageType,
            amount,
            numberOfPeople
        } = req.body;

        const newPackage = await Package.create({
            packageName,
            packageType,
            amount,
            numberOfPeople
        });

        return res.status(201).json({
            success: true,
            message: 'Package created successfully',
            data: newPackage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getAllPackages = async (req, res, next) => {
    try {
        const packages = await Package.findAll();
        console.log('packages:', packages)
        return res.status(200).json({
            //   success: true,
            //   count: packages.length,
            data: packages
        });
    } catch (error) {
        console.log('error:', error)
        next(error)
    };
}


exports.getPackageById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const packageData = await Package.findByPk(id);

        if (!packageData) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: packageData
        });
    } catch (error) {
        next(error)
    }
};


exports.updatePackage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const packageData = await Package.findByPk(id);

        if (!packageData) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        await packageData.update(req.body);

        return res.status(200).json({
            success: true,
            message: 'Package updated successfully',
            data: packageData
        });
    } catch (error) {
        next(error)
    }
};


exports.deletePackage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const packageData = await Package.findByPk(id);

        if (!packageData) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        await packageData.destroy();

        return res.status(200).json({
            success: true,
            message: 'Package deleted successfully'
        });
    } catch (error) {
        next(error)
    }
};