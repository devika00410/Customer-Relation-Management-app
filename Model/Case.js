const mongoose = require("mongoose")

const caseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Close'], default: "Open" },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports=mongoose.model("Case",caseSchema);