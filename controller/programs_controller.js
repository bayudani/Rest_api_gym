import { getAllPrograms, getProgramById } from "../models/programs_models.js";
import express from "express";

// Get all programs
export const getProgramsController = async (req, res) => {
    try {
        const programs = await getAllPrograms();
        res.status(200).json(programs);
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).json({ error: error.message || "Gagal mengambil data program" });
    }
};
// Get program by ID
export const getProgramByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const program = await getProgramById(id);
        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }
        res.status(200).json(program);
    } catch (error) {
        console.error("Error fetching program by ID:", error);
        res.status(500).json({ error: error.message || "Gagal mengambil data program" });
    }
};