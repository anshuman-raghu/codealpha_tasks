import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: String,
        description: String,
        location: String,
        salary: Number,
        remote: Boolean,
        skills: [String],
        expiresAt: Date,
    },
    { timestamps: true }
);
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ skills: 1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;
