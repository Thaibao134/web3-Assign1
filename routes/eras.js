const express = require('express');
const router = express.Router();


// Return all the eras
router.get('/eras', async (req, res) => {
    const { data, error } = await req.app.get('supabase')
        .from('eras')
        .select()
    res.send(data);
});

module.exports = router;