// Return all the eras
app.get('/api/eras', async (req, res) => {
    const { data, error } = await supabase
        .from('eras')
        .select()
    res.send(data);
});


// Returns all the galleries
app.get('/api/galleries', async (req, res) => {
    const { data, error } = await supabase
        .from('galleries')
        .select();
    res.send(data);
});


// Returns just the specified gallery
app.get('/api/galleries/:galleryId', async (req, res) => {
    const { galleryId } = req.params;

    try {
        const { data, error } = await supabase
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
app.get('/api/galleries/country/:substring', async (req, res) => {
    const { substring } = req.params;

    try { 
        const { data, error } = await supabase
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


//  Returns all the artists
app.get('/api/artists', async (req, res) => {
    const { data, error } = await supabase
        .from('artists')
        .select();
    res.send(data);
});


// Returns just the specified artist with artistId
app.get('/api/artists/:artistId', async (req, res) => {
    const { artistId } = req.params

    try{
        const { data, error } = await supabase
            .from('artists')
            .select()
            .eq('artistId', artistId)

        if (data.length === 0) {
            return res.status(404).json({message: `No artist has been found with the artistId: ${artistId}`});
        }

        res.send(data);
    } catch (error) {
        res.status(500).json({ error: `specified artist not found` });
    }

});


//  Returns the artists whose last name begins with the provided substring
app.get('/api/artists/search/:lastname', async (req, res) => {
    const { lastname } = req.params

    try {
        const { data, error } = await supabase
            .from('artists')
            .select()
            .ilike('lastName', `${lastname}%`)

        if (data.length === 0) {
            return res.status(404).json({message: `No artist has the lastname starting with ${lastname}`});
        }

        res.send(data);

    } catch (error) {
        res.status(500).json({ error: `specified artist not found` });
    }
});


//  Returns the artists whose nationality begins with the provided substring
app.get('/api/artists/country/:nationality', async (req, res) => {
    const { nationality } = req.params

    try {
        const { data, error } = await supabase
            .from('artists')
            .select()
            .ilike('nationality', `${nationality}%`)

        if (data.length === 0) {
            return res.status(404).json({ message: `No artist found with the nationality that starts with ${nationality}` });
        }

        res.send(data);

    } catch (error) {
        res.status(505).json({ error: `specified artist not found` });
    }
});


//  Returns all the paintings including all fields for artist and gallery sort by title
app.get('/api/paintings', async (req, res) => {

    try {
        const { data, error } = await supabase
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
app.get('/api/paintings/sort/:field', async (req, res) => {
    const { field } = req.params

    const SortingField = {
        title: 'title',
        year: 'yearOfWork'
    }

    if (!SortingField[field]) {
            return res.status(400).json({ error: 'Invalid sorting field. Use title or year.' });
        }

    try {
        const { data, error } = await supabase
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
app.get('/api/paintings/:id', async (req, res) => {
    const { id } = req.params

    try {
        const { data, error } = await supabase
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
app.get('/api/paintings/search/:title', async (req, res) => {
    const { title } = req.params

    try {
        const { data, error } = await supabase
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
app.get('/api/paintings/years/:start/:end', async (req, res) => {
    const { start, end } = req.params
    try {
        const { data, error } = await supabase
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
app.get('/api/paintings/galleries/:galleryId', async (req, res) => {
    const { galleryId } = req.params

    try {
        const { data, error } = await supabase
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
app.get('/api/paintings/artist/:artistId', async (req, res) => {
    const { artistId } = req.params 

    try {
        const { data, error } = await supabase
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
app.get('/api/paintings/artists/country/:nationality', async (req, res) => {
    const { nationality } = req.params

    try {
        const { data, error } = await supabase
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


// Returns all the genres with all eras fields
app.get('/api/genres', async (req, res) => {
    const { data, error } = await supabase
        .from(`genres`)
        .select(`genreId, genreName, description, wikiLink, eras (*)`);
    res.send(data);
});


// Returns just the specified genre
app.get('/api/genres/:genreId', async (req, res) => {
    const { genreId } = req.params

    try {
        const { data, error } = await supabase
            .from('genres')
            .select(`genreId, genreName, description, wikiLink, eras (*)`)
            .eq('genreId', genreId)

        if (data.length === 0) {
            return res.status(404).json({message: `No genre exist with the genreId: ${genreId}`});
        }

        res.send(data);

    } catch (error) {
        res.status(500).json({error: `specified genreId not found`});
    }
});

//  Returns the genres used in a given painting order by genreName in ascending order
app.get('/api/genres/painting/:paintingId', async (req, res) => {
    const { paintingId } = req.params
    try {
        const { data, error } = await supabase
            .from('genres')
            .select(`genreId, genreName, description, wikiLink, eras (*), paintinggenres!inner()`)
            .eq('paintinggenres.paintingId', paintingId)
            .order('genreName', {ascending: true})

        if (data.length === 0) {
            return res.status(404).json({message: `No genre exist with the genreId: ${paintingId}`});
        }

        res.send(data);

    } catch (error) {
        res.status(500).json({error: `specified paintingId not found`});
    }
});



// Returns all the paintings for a given genre (use the genreId field)
app.get('/api/paintings/genre/:genreId', async (req, res) => {
    const { genreId } = req.params

    try {
        const { data, error } = await supabase
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
app.get('/api/paintings/era/:eraId', async (req, res) => {
    const { eraId } = req.params

    try {
        const { data, error } = await supabase
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



// Returns the genre name and the number of paintings for each genre,sorted by the number of paintings 
app.get('/api/counts/genres', async (req, res) => {
    try {
        const { data, error } = await supabase
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
        res.status(500).json({error: `genres and count not found`});
    }
});



// Returns the artist name (first name space last name) and the number of paintings for each artist, sorted by the number of paintings ascending
app.get('/api/counts/artists', async (req, res) => {

    const { data, error } = await supabase
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


// Returns the genre name and the number of paintings for each genre sorted descending with counts greater than the limit param
app.get('/api/counts/topgenres/:limit', async (req, res) => {
    const { limit } = req.params

    try {
        const { data, error } = await supabase
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
        res.status(500).json({error: error.message});
    }
});