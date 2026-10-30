
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Job = require("./models/job");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Job Portal API is running");
});

app.get("/api/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/jobs", async (req, res) => {
    try {
        const job = new Job(req.body);
        const savedJob = await job.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put("/api/jobs/:id", async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete("/api/jobs/:id", async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({
            message: "Job deleted successfully",
            job: deletedJob
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
