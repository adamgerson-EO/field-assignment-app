// POST /api/update
// Updates field assignments in AirTable Collections table

const Airtable = require('airtable');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { changes } = req.body;

    if (!changes || !Array.isArray(changes) || changes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No changes provided'
      });
    }

    // Validate changes
    for (const change of changes) {
      if (!change.fieldId || !change.technicianId || !change.scheduledDate) {
        return res.status(400).json({
          success: false,
          error: 'Each change must have fieldId, technicianId, and scheduledDate'
        });
      }
    }

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // AirTable allows up to 10 records per update call
    const batches = [];
    for (let i = 0; i < changes.length; i += 10) {
      batches.push(changes.slice(i, i + 10));
    }

    const results = [];
    for (const batch of batches) {
      const records = batch.map(change => ({
        id: change.fieldId,
        fields: {
          'Field Team Planned': [change.technicianId],
          'Schedule Date': change.scheduledDate,
          'Schedule Status': 'Scheduled-Confirmed'
        }
      }));

      const updated = await base('Collections').update(records);
      results.push(...updated.map(r => r.id));
    }

    return res.status(200).json({
      success: true,
      message: `Updated ${results.length} field(s)`,
      updatedIds: results
    });

  } catch (error) {
    console.error('AirTable API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update fields in AirTable'
    });
  }
};
