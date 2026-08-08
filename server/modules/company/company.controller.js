const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const companyService = require("./company.service");

exports.createCompany = asyncHandler(async (req, res) => {

    const company = await companyService.createCompany(
        req.body,
        req.user._id
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Company created successfully",
            company
        )
    );
});

exports.getCompanies = asyncHandler(async (req, res) => {

    const companies = await companyService.getCompanies(req.query, req.user);

    res.status(200).json(
        new ApiResponse(
            200,
            "Companies fetched successfully",
            companies
        )
    );
});

exports.getCompanyById = asyncHandler(async (req, res) => {

    const company = await companyService.getCompanyById(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Company fetched successfully",
            company
        )
    );
});

exports.updateCompany = asyncHandler(async (req, res) => {

    const company = await companyService.updateCompany(
        req.params.id,
        req.body,
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Company updated successfully",
            company
        )
    );
});

exports.deleteCompany = asyncHandler(async (req, res) => {

    await companyService.deleteCompany(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Company deleted successfully"
        )
    );
});

exports.restoreCompany = asyncHandler(async (req, res) => {

    const company = await companyService.restoreCompany(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Company restored successfully",
            company
        )
    );
});

exports.getCompanyStats = asyncHandler(async (req, res) => {

    const stats = await companyService.getCompanyStats();

    res.status(200).json(
        new ApiResponse(
            200,
            "Company statistics fetched successfully",
            stats
        )
    );
});

exports.uploadCompanyLogo = async(req,res,next)=>{

    try{

        const company = await companyService.uploadCompanyLogo(
            req.params.id,
            req.file.path,
            req.user._id
        );


        res.status(200).json({
            success:true,
            message:"Company logo uploaded successfully",
            data:company
        });

    }
    catch(error){
        next(error);
    }

};