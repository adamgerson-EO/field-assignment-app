// GET /api/unavailability
// Returns technician unavailability (PTO, training, etc.)
//
// TODO: This currently returns mock data.
// In production, create an "Unavailability" table in AirTable with fields:
//   - Technician (linked to Field Team)
//   - Start Date
//   - End Date
//   - Reason (PTO, Training, Medical, etc.)

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

  // Mock data - replace with AirTable query when table is created
  // Structure: { technicianId: [{ start, end, reason }] }
  const unavailability = {
    'rec19WXXxX0vgl4GK': [
      { start: '2026-02-03', end: '2026-02-04', reason: 'PTO' }
    ],
    'recW0W5sa8HQnQNFw': [
      { start: '2026-02-10', end: '2026-02-12', reason: 'Training' }
    ],
    'recZByWtzzl3iYRAE': [
      { start: '2026-02-07', end: '2026-02-07', reason: 'PTO' }
    ],
    'recdLkXjdmNtzsRTm': [
      { start: '2026-02-05', end: '2026-02-06', reason: 'PTO' }
    ]
  };

  return res.status(200).json({
    success: true,
    unavailability,
    _note: 'This is mock data. Create an Unavailability table in AirTable for production use.'
  });
};
