import express from 'express';
import { getAllMemberships, getMembershipById } from '../models/membership_models.js';
import redisClient from '../helpers/redis-client.js';

const DEFAULT_EXPIRE_TIME = 60 * 60 * 24; // 1 day in seconds
// get all memberships
export const getMemberships = async (req, res) => {
    try {
        // // Cek cache Redis dulu
        // const cachedMemberships = await redisClient.get('memberships');
        // if (cachedMemberships) {
        //     console.log('Mengambil memberships dari cache Redis');
        //     // Jika ada, parse JSON dan kirim sebagai response
        //     return res.json(JSON.parse(cachedMemberships));
        // }
        // klo gada cache, ambil dari database
        console.log('Mengambil memberships dari database');
        const memberships = await getAllMemberships();
        res.json(memberships);
        // // Simpan hasil ke cache Redis dengan expire time
        // await redisClient.set('memberships', JSON.stringify(memberships), {    
        //     EX: DEFAULT_EXPIRE_TIME // Set expire time to 1 day
        // });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// get membership by ID
export const getMembershipByIds = async (req, res) => {
    const { id } = req.params;
    // const cacheId = `membership:${id}`;
    try {
        // Cek cache Redis dulu
        // const cachedMembership = await redisClient.get(cacheId);
        // if (cachedMembership) {
        //     console.log('Mengambil membership dari cache Redis');
        //     // Jika ada, parse JSON dan kirim sebagai response
        //     return res.json(JSON.parse(cachedMembership));
        // }
        const membership = await getMembershipById(id);
        if (!membership) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        // Simpan hasil ke cache Redis dengan expire time
        // console.log('Mengambil membership dari database');
        // await redisClient.set(cacheId, JSON.stringify(membership), {
        //     EX: DEFAULT_EXPIRE_TIME // Set expire time to 1 day
        // });
        res.json(membership);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};