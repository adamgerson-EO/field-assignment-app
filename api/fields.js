// GET /api/fields
// Returns field data from AirTable Collections table
// Scoped to US-based fields with coordinates

const Airtable = require('airtable');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    const records = await base('Collections')
      .select({
        // Filter for US fields with coordinates
        filterByFormula: `AND(
          {Latitude} != '',
          {Longitude} != '',
          OR({State} = 'Kansas', {State} = 'Oklahoma', {State} = 'Texas', {State} = 'Nebraska', {State} = 'Iowa', {State} = 'Illinois')
        )`,
        fields: [
          'Field_Name',
          'Latitude',
          'Longitude',
          'Acres',
          'State',
          'Schedule Status',
          'Latest Available',
          'Field Team Planned',
          'Schedule Date',
          'Productivity (acreage) (from All Engagements)'
        ],
        maxRecords: 500
      })
      .all();

    const fields = records.map(record => ({
      id: record.id,
      name: record.get('Field_Name') || 'Unnamed Field',
      lat: parseFloat(record.get('Latitude')) || 0,
      lng: parseFloat(record.get('Longitude')) || 0,
      acres: parseFloat(record.get('Acres')) || 0,
      state: record.get('State') || '',
      status: record.get('Schedule Status') || 'Not Scheduled',
      latestAvailable: record.get('Latest Available') || null,
      technicianId: record.get('Field Team Planned')?.[0] || null,
      scheduledDate: record.get('Schedule Date') || null,
      acresPerDay: parseFloat(record.get('Productivity (acreage) (from All Engagements)')?.[0]) || 40
    }));

    return res.status(200).json({
      success: true,
      count: fields.length,
      fields
    });

  } catch (error) {
    console.error('AirTable API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch fields from AirTable'
    });
  }
};
