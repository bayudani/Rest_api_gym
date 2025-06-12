import express from 'express';
import { getAllMemberships, getMembershipById } from '../models/membership_models.js';

// get all memberships
export const getMemberships = async (req, res) => {
    try {
        const memberships = await getAllMemberships();
        res.json(memberships);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// get membership by ID
export const getMembershipByIds = async (req, res) => {
    const { id } = req.params;
    try {
        const membership = await getMembershipById(id);
        if (!membership) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        res.json(membership);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};