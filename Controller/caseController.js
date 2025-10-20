const Case= require('../Model/Case')

// Get all case
exports.getCases=async (req,res) =>{
    try{
        const cases=await Case.find().popuulate('customerId')
        res.json(cases)
    } catch(error){
        res.status(500).json({error:error.message})
    }
}

// Add new case
exports.addCase=async (req,res)=>{
    try{
    const caseItem =new Case(req.body);
    await caseItem.save();
    await caseItem.populate('customerId')
    res.status(201).json(caseItem)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

// Update case
exports.updateCase=async (req,res)=>{
    try{
    const caseItem=await Case.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate('customerId');
    if(!caseItem){
        return res.status(404).json({message:"Case not found"})
    }
    res.json(caseItem)
}
    catch(error){
        res.status(400).json({error:error.message})

    }
}

// Delete Case

exports.deleteCase=async (req,res)=>{
    try{
        const caseItem=await Case.findByIdAndDelete(req.params.id)
        if(!caseItem){
            return res.status(404).json({message:"Case not found"})
        }
        res.json({message:"Case deleted successfully"})
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}

