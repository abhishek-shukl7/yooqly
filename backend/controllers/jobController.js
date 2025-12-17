const { validationResult } = require("express-validator");
const jobService = require("../services/jobService");
const customerService = require("../services/customerService");

module.exports.getJob = async (req,res,next) => {
    try {
        const job = await jobService.getJobById(req.params.id);
        const customer = await customerService.getCustomerById(job.customerId);
        if (!job || !customer) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        const response = {
            job : job,
            customer : customer
        }
        return res.status(200).json({ response });
    } catch (err) {
        console.error('Error fetching job by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.createJob = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const { customerId ,quantity,jobDetails,deadline,estimatedCost,priority,requirements,comments,status} = req.body;

    

    const job = await jobService.createJob({
        companyId : req.user.company.companyId,
        customerId : customerId,
        quantity: quantity,
        userId: req.user.user.userId,
        jobDetails: jobDetails,
        deadline: deadline,
        status: status,
        priority: priority,
        requirements: requirements,
        comments: comments,
        estimatedCost: estimatedCost
    });

    return res.status(200).json({job: job});
}


module.exports.updateJob = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    try {
        const updatedJob = await jobService.updateJob(req.params.id, req.body);
        if (!updatedJob) {
            return res.status(404).json({ message: 'job not found.' });
        }
        return res.status(200).json({ job: updatedJob });
    } catch (err) {
        console.error('Error updating job:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs(req.user.company.companyId);
        return res.status(200).json({ jobs });
    } catch (err) {
        console.error('Error fetching all orders:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.getProductionJobs = async (req, res) => {
    try {
        const jobs = await jobService.getProductionJobs(req.user.company.companyId);
        return res.status(200).json({ jobs });
    } catch (err) {
        console.error('Error fetching all orders:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// module.exports.deleteJob = async (req, res) => {
//     try {
//         const deletedJob = await JobService.deleteJob(req.params.id);
//         if (!deletedJob) {
//             return res.status(404).json({ message: 'job not found.' });
//         }
//         return res.status(200).json({ message: 'job deleted successfully.' });
//     } catch (err) {
//         console.error('Error deleting job:', err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

