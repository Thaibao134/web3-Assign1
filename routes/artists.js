const express = require('express');
const router = express.Router();
const { handleServerError, handleNotFoundError, handlePartialMatchError } = require('../helpers/errorHandlers');


//  Returns all the artists
router.get('/artists', async (req, res) => {
    const { data, error } = await req.app.get('supabase')
        .from('artists')
        .select();
    res.send(data);
});


// Returns just the specified artist with artistId
router.get('/artists/:artistId', async (req, res) => {
    const { artistId } = req.params

    try{
        const { data, error } = await req.app.get('supabase')
            .from('artists')
            .select()
            .eq('artistId', artistId)

        if (data.length === 0) {
            return handleNotFoundError(res, 'Artist', 'artistId', artistId);
        }

        res.send(data);
    } catch (error) {
        return handleServerError(res, 'Failed to retrieve the artist');
    }

});


//  Returns the artists whose last name begins with the provided substring
router.get('/artists/search/:lastname', async (req, res) => {
    const { lastname } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('artists')
            .select()
            .ilike('lastName', `${lastname}%`)

        if (data.length === 0) {
            return handlePartialMatchError(res, 'Artist', 'lastname', 'starting', lastname);
        }

        res.send(data);

    } catch (error) {
        return handleServerError(res, 'Failed to retrieve the artist');
    }
});


//  Returns the artists whose nationality begins with the provided substring
router.get('/artists/country/:nationality', async (req, res) => {
    const { nationality } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('artists')
            .select()
            .ilike('nationality', `${nationality}%`)

        if (data.length === 0) {
            return res.status(404).json({ message: `No artist found with the nationality that starts with ${nationality}` });
        }

        res.send(data);

    } catch (error) {
        handleServerError(res, 'Failed to retrieve the artist');
    }
});

// Returns the artist name (first name space last name) and the number of paintings for each artist, sorted by the number of paintings ascending
router.get('/counts/artists', async (req, res) => {

    const { data, error } = await req.app.get('supabase')
        .from('artists')
        .select(`firstName, lastName, paintings!inner(count)`)

    //create array of objects with full name and their painting counts
    const ArtistPaintingCounts = data.map(item => ({
        ArtistName: `${item.firstName} ${item.lastName}`,
        paintingCount: item.paintings[0].count
    }));

    //sort descending based on count
    ArtistPaintingCounts.sort((a, b) => b.paintingCount - a.paintingCount);
    res.send(ArtistPaintingCounts);
});


module.exports = router;