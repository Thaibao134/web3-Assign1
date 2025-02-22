const express = require('express');
const router = express.Router();


//  Returns all the paintings including all fields for artist and gallery sort by title
router.get('/paintings', async (req, res) => {

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber,
                copyrightText, description, excerpt, yearOfWork, width, height, medium, cost,
                MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists (*), galleries (*)`)
            .order('title', { ascending: true })
            
        res.send(data);
    } catch {
        res.status(500).json({error : error.message});
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
            .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber,
                copyrightText, description, excerpt, yearOfWork, width, height, medium, cost,
                MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists (*), galleries (*)`)
            .order(SortingField[field], { ascending: true })
            
        res.send(data);
    } catch {
        res.status(500).json({error : error.message});
    }
});


// Returns just the specified painting
router.get('/paintings/:id', async (req, res) => {
    const { id } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber,
                copyrightText, description, excerpt, yearOfWork, width, height, medium, cost,
                MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists (*), galleries (*)`)
            .eq('paintingId', id)
            
        if (data.length === 0) {
            return res.status(404).json({message: `No paintings is found with the id ${id}`});
        }

        res.send(data);

    } catch (error) {
        res.status(500).json({error : `specified painting not found`});
    }
});


// Returns the paintings whose title contains the provided substring
router.get('/paintings/search/:title', async (req, res) => {
    const { title } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber,
                copyrightText, description, excerpt, yearOfWork, width, height, medium, cost,
                MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists (*), galleries (*)`)
            .ilike('title', `%${title}%`)
            .order('title', { ascending: true })
            
        if (data.length === 0) {
            return res.status(404).json({message: `No paintings is found with the title ${title}`});
        }

        res.send(data);

    } catch (error) {
        res.status(500).json({error : `specified painting not found`});
    }
});


// Returns the paintings between two years (inclusive) ordered by yearOfWork
router.get('/paintings/years/:start/:end', async (req, res) => {
    const { start, end } = req.params
    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber,
                copyrightText, description, excerpt, yearOfWork, width, height, medium, cost,
                MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists (*), galleries (*)`)
            .gte('yearOfWork', start)
            .lte('yearOfWork', end)
            .order('yearOfWork', { ascending: true })
            
        if (parseInt(start) > parseInt(end)) {
            return res.status(404).json({message: `start year can not be greater than end year`});
        }

        if (data.length === 0) {
            return res.status(404).json({message: `No paintings is found with the years ${start} and ${end}`});
        }

        res.send(data);
    } catch (error) {
        res.status(500).json({error : `specified paintings not found`});
    }
});


// Returns all the paintings in a given gallery with galleryId ordered by title
router.get('/paintings/galleries/:galleryId', async (req, res) => {
    const { galleryId } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber,
                copyrightText, description, excerpt, yearOfWork, width, height, medium, cost,
                MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists (*), galleries (*)`)
            .eq('galleryId', galleryId)
            .order('title', { ascending: true })
    
        if (data.length === 0) {
            return res.status(404).json({message: `No paintings exist with the galleryId: ${galleryId}`});
        }

        res.send(data);

    }  catch (error) {
        res.status(500).json({error: `specified gallery not found`});
    }

});


// Returns all the paintings by a given artist with artistId
router.get('/paintings/artist/:artistId', async (req, res) => {
    const { artistId } = req.params 

    try {
        const { data, error } = await req.app.get('supabase')
        .from('paintings')
        .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber,
            copyrightText, description, excerpt, yearOfWork, width, height, medium, cost,
            MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists (*), galleries (*)`)
        .eq('artistId', artistId)
        .order('title', { ascending: true })

        if (data.length === 0) {
            return res.status(404).json({message: `No paintings exist with the artistId: ${artistId}`})
        }

        res.send(data);

    } catch (error) {
        res.status(500).json({error: `specified artistId not found`});
    }

});

// Returns all the paintings by artists whose nationality begins with the provided substring order by title
router.get('/paintings/artists/country/:nationality', async (req, res) => {
    const { nationality } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`paintingId, imageFileName, title, shapeId, museumLink, accessionNumber,
            copyrightText, description, excerpt, yearOfWork, width, height, medium, cost,
            MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations, artists!inner (*), galleries (*)`)
            .ilike('artists.nationality', `${nationality}%`)
            .order('title', { ascending: true })

        if (data.length === 0) {
            return res.status(404).json({ message: `No paintings exist with the nationality: ${nationality}` })
        }

        res.send(data);

    } catch (error) {
        res.status(500).json({ error: `specified nationality not found` });
    }
});

// Returns all the paintings for a given genre (use the genreId field)
router.get('/paintings/genre/:genreId', async (req, res) => {
    const { genreId } = req.params

    try {
        const { data, error } = await req.app.get('supabase')
            .from('paintings')
            .select(`paintingId, title, yearOfWork, paintinggenres!inner ()`)
            .eq('paintinggenres.genreId', genreId)
            .order('yearOfWork', {ascending: true})
        
        if (data.length === 0) {
            return res.status(404).json({message: `No paintings exist with the genreId: ${genreId}`});
        }

        res.send(data);

    } catch (error) {
        res.status(500).json({error: `specified genreId not found`});
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
            return res.status(404).json({message: `No paintings exist with the eraId: ${eraId}`});
        }
        
        res.send(paintingEras);
    } catch {
        res.status(500).json({error: `specified eraId not found`});
    }
});

module.exports = router;