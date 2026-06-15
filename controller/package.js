const { Package, Vendor, Tourist } = require('../models');


exports.createPackage = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const touristId = req.params.touristId;
        const { packageName, packageType, amount, numberOfPeople } = req.body;
        const vendor = await Vendor.findByPk(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        };

        const tourist = await Tourist.findByPk(touristId);

        if (!tourist) {
            return res.status(404).json({
                success: false,
                message: 'Tourist not found'
            });
        };

        const newPackage = await Package.create({
            vendorId: vendor.dataValues.id,
            touristId: tourist.dataValues.id,
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
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: error.message

        });
    }
};


exports.getAllPackages = async (req, res, next) => {
    try {
        const packages = await Package.findAll();
        return res.status(200).json({
            message: 'Packages retrieved successfully',
            data: packages
        });
    } catch (error) {
        console.log('error:', error)
        next(error)
    };
};


exports.getPackageById = async (req, res, next) => {
    try {
        const { packageId } = req.params;
        const package = await Package.findByPk(packageId);

        if (!package) {
            return res.status(404).json({
                message: 'Package not found'
            });
        };

        return res.status(200).json({
            message: 'Package retrieved successfully',
            data: package
        });
    } catch (error) {
        next(error)
    }
};


exports.updatePackage = async (req, res, next) => {
    try {
        const vendorId = req.user.id;
        const { packageId } = req.params;
        const { packageName, packageType, amount, numberOfPeople } = req.body;
        const vendor = await Vendor.findByPk(vendorId);
        const package = await Package.findByPk(packageId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        };

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        };

        const data = {
            packageName: packageName || package.packageName,
            packageType: packageType || package.packageType,
            amount: amount || package.amount,
            numberOfPeople: numberOfPeople || package.numberOfPeople
        }

        await package.update(data);

        return res.status(200).json({
            message: 'Package updated successfully',
            data: package
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
            message: 'Package deleted successfully'
        });
    } catch (error) {
        next(error)
    }
};
