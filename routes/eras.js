const express = require('express');
const router = express.Router();
const { handleServerError, handleNotFoundError, handlePartialMatchError, handleMultipleYearError, handleYearError } = require('../helpers/errorHandlers');

// Return all the eras
router.get('/eras', async (req, res) => {
    const { data, error } = await req.app.get('supabase')
        .from('eras')
        .select()
    res.send(data);
});

module.exports = router;