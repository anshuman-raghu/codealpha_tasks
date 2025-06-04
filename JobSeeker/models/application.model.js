import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    resume: {
        type: String,
    },
    status: {
        type: String,
        enum: ["applied", "screening", "interview", "rejected", "hired"],
        default: "applied",
    },
});
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
