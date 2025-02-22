const express = require('express');
const router = express.Router();
const { handleServerError, handleNotFoundError, handlePartialMatchError } = require('../helpers/errorHandlers');


// Returns all the galleries
router.get('/galleries', async (req, res) => {
    const { data, error } = await req.app.get('supabase')
        .from('galleries')
        .select();
    res.send(data);
});


// Returns just the specified gallery
router.get('/galleries/:galleryId', async (req, res) => {
    const { galleryId } = req.params;

    try {
        const { data, error } = await req.app.get('supabase')
            .from('galleries')
            .select()
            .eq('galleryId', `${galleryId}`)

        if (data.length === 0) {
            return handleNotFoundError(res, 'galleries', 'galleryId', galleryId);
        }
        res.send(data);
    } catch (error) {
        return handleServerError(res, "failed to retrieve the galleries")
    }
});


//  Returns the galleries whose galleryCountry begins with the provided substring
router.get('/galleries/country/:substring', async (req, res) => {
    const { substring } = req.params;

    try { 
        const { data, error } = await req.app.get('supabase')
            .from('galleries')
            .select()
            .ilike('galleryCountry', `${substring}%`)

            if (data.length === 0) {
                return handlePartialMatchError(res, 'galleries', 'country', 'starting: ', substring)
                return res.status(404).json({ message: `No galleries found for the specified country starting with ${substring}.` });
        }

    res.send(data);
    } catch {
        return handleServerError(res, "failed to retrieve the galleries")
    } 
});

module.exports = router;