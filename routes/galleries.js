const express = require('express');
const router = express.Router();


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
            return res.status(404).json({message: `No galleries found for the specificed galleryID: ${galleryId}`});
        }
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: `specified gallery not found` });
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
                return res.status(404).json({ message: `No galleries found for the specified country starting with ${substring}.` });
        }

    res.send(data);
    } catch {
        res.status(500).json({ error: `specified gallery not found` });
    } 
});

module.exports = router;