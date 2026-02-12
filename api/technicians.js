// GET /api/technicians
// Returns active EarthOptics technicians from Field Team table

const Airtable = require('airtable');

// Consistent colors for technicians
const TECH_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

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

    const records = await base('Field Team')
      .select({
        filterByFormula: `AND(
          {Inactive} = FALSE(),
          {Engagement} = 'Active',
          OR({Employee Type} = 'EarthOptics', {Employee Type} = 'Partner')
        )`,
        fields: [
          'Short Name',
          'First Name',
          'Last Name',
          'Home Base Location',
          'Employee Type'
        ],
        maxRecords: 50
      })
      .all();

    const technicians = records.map((record, index) => ({
      id: record.id,
      name: record.get('Short Name') || `${record.get('First Name')} ${record.get('Last Name')?.charAt(0)}.`,
      fullName: `${record.get('First Name') || ''} ${record.get('Last Name') || ''}`.trim(),
      location: record.get('Home Base Location') || '',
      employeeType: record.get('Employee Type')?.[0] || 'Unknown',
      color: TECH_COLORS[index % TECH_COLORS.length]
    }));

    return res.status(200).json({
      success: true,
      count: technicians.length,
      technicians
    });

  } catch (error) {
    console.error('AirTable API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch technicians from AirTable'
    });
  }
};
