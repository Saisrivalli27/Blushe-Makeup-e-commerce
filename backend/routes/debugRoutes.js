const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  
  res.json({
    supabaseUrl: url ? url : 'MISSING',
    supabaseKeyPreview: key ? key.substring(0, 15) + '...' : 'MISSING'
  });
});

module.exports = router;
