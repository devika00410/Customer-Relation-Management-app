const Customer=require('../Model/Customer')


// Get all customers
const getCustomers=async(req,res)=>{
    try{
        const customers=await Customer.find();
        res.json(customers)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}

// Add new customers

const addCustomer=async (req,res)=>{
    try{
        const customer=new Customer(req.body)
        await customer.save()
        res.status(201).json(customer)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

// Update Customer

const updateCustomer= async (req,res)=>{
    try{
        const customer= await Customer.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!customer){
            return res.status(404).json({message:"Customer not found"})
        }
        res.json(customer)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

// Delete customer

const deleteCustomer = async(req,res)=>{
    try{
        const customer=await Customer.findByIdAndDelete(req.params.id)
        if(!customer){
            return res.status(404).json({message:"Customer not found"})
        }
        res.json({message:"Customer deleted successfully"})
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}

module.exports={getCustomers,addCustomer,updateCustomer,deleteCustomer}