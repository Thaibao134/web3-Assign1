const express = require('express');
const router = express.Router();
const { handleServerError, handleNotFoundError, handlePartialMatchError } = require('../helpers/errorHandlers');


// Returns all the genres with all eras fields
router.get('/genres', async (req, res) => {
    const { data, error } = await req.app.get('supabase')
        .from(`genres`)
        .select(`genreId, genreName, description, wikiLink, eras (*)`);
    res.send(data);
});


// Returns just the specified genre
router.get('/genres/:genreId', async (req, res) => {
    const { genreId } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('genres')
            .select(`genreId, genreName, description, wikiLink, eras (*)`)
            .eq('genreId', genreId)

        if (data.length === 0) {
            return handleNotFoundError(res, 'genre', 'genreId', genreId);
        }

        res.send(data);

    } catch (error) {
        return handleServerError(res, "failed to retrieve the genres")
    }
});

//  Returns the genres used in a given painting order by genreName in ascending order
router.get('/genres/painting/:paintingId', async (req, res) => {
    const { paintingId } = req.params
    try {
        const { data, error } = await req.app.get('supabase')
            .from('genres')
            .select(`genreId, genreName, description, wikiLink, eras (*), paintinggenres!inner()`)
            .eq('paintinggenres.paintingId', paintingId)
            .order('genreName', {ascending: true})

        if (data.length === 0) {
            return handleNotFoundError(res, 'genre', 'paintingId', paintingId);
        }

        res.send(data);

    } catch (error) {
        return handleServerError(res, "failed to retrieve the genres")
    }
});

// Returns the genre name and the number of paintings for each genre,sorted by the number of paintings 
router.get('/counts/genres', async (req, res) => {
    try {
        const { data, error } = await req.app.get('supabase')
            .from('genres')
            .select('genreName, paintinggenres!inner(count)');

        const genrePaintingCounts = data.map(item => ({
            genreName: item.genreName,
            paintingCount: item.paintinggenres[0].count
        }));

        //sort ascending based on count
        genrePaintingCounts.sort((a, b) => a.paintingCount - b.paintingCount); 
        res.send(genrePaintingCounts);

    } catch {
        return handleServerError(res, "failed to retrieve the genres")
    }
});

// Returns the genre name and the number of paintings for each genre sorted descending with counts greater than the limit param
router.get('/counts/topgenres/:limit', async (req, res) => {
    const { limit } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('genres')
            .select('genreName, paintinggenres!inner(count)')

        //create array of objects with full name and their painting counts
        const GenrePaintingCounts = data.map(item => ({
            genreName: item.genreName,
            paintingCount: item.paintinggenres[0].count
        }));

        //filter based on genres greater than the count
        const filteredGenres = GenrePaintingCounts.filter(genre => genre.paintingCount > parseInt(limit));

        //sort the filtered genres descending
        filteredGenres.sort((a, b) => b.paintingCount - a.paintingCount);

        if (filteredGenres.length === 0) {
            return res.status(404).json({message: `No genres exist that exceeds the number of paintings: ${limit}`});
        } 

        res.send(filteredGenres);

    } catch {
        return handleServerError(res, "failed to retrieve the genres")
    }
});

module.exports = router;