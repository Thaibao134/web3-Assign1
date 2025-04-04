const express = require('express');
const router = express.Router();
const { handleServerError, handleNotFoundError, handlePartialMatchError, handleMultipleYearError, handleYearError } = require('../helpers/errorHandlers');

// includes all paintingColumns excluding foreign keys, and includes all columns from the artist and gallery fields.
const paintingColumns =`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber, 
                      copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, 
                      MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists (*), galleries (*)` 

const paintingColumnsNoArtist =`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber, 
            copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, 
            MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, galleries (*)` 

                      
//  Returns all the paintings including all fields for artist and gallery sort by title
router.get('/paintings', async (req, res) => {

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(paintingColumns)
            .order('title', { ascending: true })
            
        res.send(data);
    } catch {
        return handleServerError(res, "failed to retrieve the paintings")
    }
});



// Returns all the paintings, sorted by either title or yearOfWork
router.get('/paintings/sort/:field', async (req, res) => {
    const { field } = req.params

    const SortingField = {
        title: 'title',
        year: 'yearOfWork'
    }

    if (!SortingField[field]) {
            return res.status(400).json({ error: 'Invalid sorting field. Use title or year.' });
        }

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(paintingColumns)
            .order(SortingField[field], { ascending: true })
            
        res.send(data);
    } catch {
        return handleServerError(res, "failed to retrieve the paintings")
    }
});


// Returns just the specified painting
router.get('/paintings/:id', async (req, res) => {
    const { id } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(paintingColumns)
            .eq('paintingId', id)
            
        if (data.length === 0) {
            return handleNotFoundError(res, 'paintings', 'paintingId', id);
        }

        res.send(data);

    } catch (error) {
        return handleServerError(res, "failed to retrieve the paintings")
    }
});


// Returns the paintings whose title contains the provided substring
router.get('/paintings/search/:title', async (req, res) => {
    const { title } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(paintingColumns)
            .ilike('title', `%${title}%`)
            .order('title', { ascending: true })
            
        if (data.length === 0) {
            return handlePartialMatchError(res, 'paintings', 'title', 'that contains the values', title);
        }

        res.send(data);

    } catch (error) {
        return handleServerError(res, "failed to retrieve the paintings")
    }
});


// Returns the paintings between two years (inclusive) ordered by yearOfWork
router.get('/paintings/years/:start/:end', async (req, res) => {
    const { start, end } = req.params
    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(paintingColumns)
            .gte('yearOfWork', start)
            .lte('yearOfWork', end)
            .order('yearOfWork', { ascending: true })
            
        if (parseInt(start) > parseInt(end)) {
            return handleYearError(res);
        }

        if (data.length === 0) {
            return handleMultipleYearError(res, 'paintings', start, end);
        }

        res.send(data);
    } catch (error) {
        console.error(error)
        return handleServerError(res, "failed to retrieve the paintings")
    }
});


// Returns all the paintings in a given gallery with galleryId ordered by title
router.get('/paintings/galleries/:galleryId', async (req, res) => {
    const { galleryId } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(paintingColumns)
            .eq('galleryId', galleryId)
            .order('title', { ascending: true })
    
        if (data.length === 0) {
            return handleNotFoundError(res, 'paintings', 'galleryId', galleryId);
        }

        res.send(data);

    }  catch (error) {
        return handleServerError(res, "failed to retrieve the paintings")
    }

});


// Returns all the paintings by a given artist with artistId
router.get('/paintings/artist/:artistId', async (req, res) => {
    const { artistId } = req.params 

    try {
        const { data, error } = await req.app.get('supabase')
        .from('paintings')
        .select(paintingColumns)
        .eq('artistId', artistId)
        .order('title', { ascending: true })

        if (data.length === 0) {
            return handleNotFoundError(res, 'paintings', 'artistId', artistId);
        }

        res.send(data);

    } catch (error) {
        return handleServerError(res, "failed to retrieve the paintings")
    }

});


//FIX THIS
// Returns all the paintings by artists whose nationality begins with the provided substring order by title
router.get('/paintings/artist/country/:nationality', async (req, res) => {
    const { nationality } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber, 
                      copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, 
                      MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists!inner (*), galleries!inner (*)` )
            .ilike('artists.nationality', `${nationality}%`)
            .order('title', { ascending: true })

        if (data.length === 0) {
            return handlePartialMatchError(res, 'paintings', 'nationality', 'starting', nationality);
        }
        res.send(data);

    } catch (error) {
        return handleServerError(res, "failed to retrieve the paintings")
    }
});

// Returns all the paintings for a given genre (use the genreId field) sorted by yearofWork
router.get('/paintings/genre/:genreId', async (req, res) => {
    const { genreId } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`${paintingColumnsNoArtist}, paintinggenres!inner (), artists!inner (*)`)
            // .select(`paintingId, title, yearOfWork, imageFileName, paintinggenres!inner (), artists!inner (*)`)
            .eq('paintinggenres.genreId', genreId)
            .order('yearOfWork', {ascending: true})



            // .eq('artistId', artistId)
        
        if (data.length === 0) {
            return handleNotFoundError(res, 'paintings', 'genreId', genreId);
        }

        res.send(data);

    } catch (error) {
        return handleServerError(res, "failed to retrieve the paintings")
    }
});

// Returns all the paintings for a given era
router.get('/paintings/era/:eraId', async (req, res) => {
    const { eraId } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintinggenres')
            .select('genres!inner(), paintings!inner(paintingId, title, yearOfWork)')
            .eq('genres.eraId', eraId);

        // process the data into something that we can order
        const paintingEras = data.map(item => ({
            paintingId: item.paintings.paintingId,
            title: item.paintings.title,
            year: item.paintings.yearOfWork, 
        }));

        paintingEras.sort((a, b) => a.year - b.year); 


        if (paintingEras.length === 0) {
            return handleNotFoundError(res, 'paintings', 'eraId', eraId);
        }
        
        res.send(paintingEras);
    } catch {
        return handleServerError(res, "failed to retrieve the paintings")
    }
});

module.exports = router;