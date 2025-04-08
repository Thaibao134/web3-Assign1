const cors = require('cors');
const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();

app.use(cors());

const supaUrl = process.env.supaUrl;
const supaAnonKey = process.env.supaAnonKey;
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.set('supabase', supabase); 

//route handlers for different api's
const eraRoutes = require('./routes/eras');
const galleriesRoutes = require('./routes/galleries');
const artistsRoutes = require('./routes/artists');
const paintingsRoutes = require('./routes/paintings');
const genresRoutes = require('./routes/genres');

//use different api routes for different paths
app.use('/api', eraRoutes);
app.use('/api', galleriesRoutes);
app.use('/api', artistsRoutes);
app.use('/api', paintingsRoutes);
app.use('/api', genresRoutes);

//setting port and start server
let port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('http://localhost:' + port);
    });






















