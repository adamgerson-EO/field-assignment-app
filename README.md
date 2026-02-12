# Field Assignment App

A web application for EarthOptics Operations Team to assign fields to technicians using map and timeline views.

## Features

- **Map View**: Interactive map with lasso selection for batch field assignments
- **Timeline View**: Drag-and-drop Gantt-style scheduling with 14-day view
- **Urgent Field Highlighting**: Fields with "Latest Available" date within 2 weeks shown in orange
- **Technician Unavailability**: PTO/training dates blocked from scheduling
- **AirTable Integration**: Real-time data from EarthOptics AirTable base
- **Batch Save**: Changes tracked locally, saved to AirTable on demand

## Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd field-assignment-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and add your AirTable API key:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
AIRTABLE_API_KEY=pat_xxxxxxxxxxxx
AIRTABLE_BASE_ID=appeR8QJsZkRPLHQy
```

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Deployment to Vercel

### First-time setup

1. Install Vercel CLI (if not already):
   ```bash
   npm i -g vercel
   ```

2. Link to Vercel:
   ```bash
   vercel link
   ```

3. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`

4. Deploy:
   ```bash
   npm run deploy
   ```

### Subsequent deployments

Just push to your main branch (if you've set up Git integration) or run:

```bash
npm run deploy
```

## AirTable Configuration

### Required API Token Scopes

Create a Personal Access Token at https://airtable.com/create/tokens with:

- **Scope**: `data.records:read` (required), `data.records:write` (for saving)
- **Base access**: EarthOptics Fields (`appeR8QJsZkRPLHQy`)
- **Table access**: Collections, Field Team

### Data Mapping

| App Field | AirTable Table | AirTable Field |
|-----------|---------------|----------------|
| Field name | Collections | `Field_Name` |
| Coordinates | Collections | `Latitude`, `Longitude` |
| Acres | Collections | `Acres` |
| Latest Available | Collections | `Latest Available` |
| Schedule Status | Collections | `Schedule Status` |
| Assigned Tech | Collections | `Field Team Planned` |
| Schedule Date | Collections | `Schedule Date` |
| Technician name | Field Team | `Short Name`, `First Name`, `Last Name` |
| Tech location | Field Team | `Home Base Location` |

## Development with Claude Cowork

This project is designed for collaborative development using Claude Cowork.

### For collaborators

1. Clone this repo to your local machine
2. Open Claude Cowork and select the project folder
3. Ask Claude to help you iterate on features
4. Push changes back to the repo

### Project structure

```
field-assignment-app/
├── public/           # Frontend HTML files
│   ├── index.html    # Map view
│   └── timeline.html # Timeline view
├── api/              # Vercel serverless functions
│   ├── fields.js     # GET /api/fields
│   ├── technicians.js# GET /api/technicians
│   ├── unavailability.js # GET /api/unavailability
│   └── update.js     # POST /api/update
├── .env.example      # Environment variable template
├── vercel.json       # Vercel deployment config
└── package.json
```

## Roadmap / Future Features

- [ ] Technician unavailability from AirTable table
- [ ] Real-time sync (auto-save)
- [ ] Multi-day field assignments (spanning multiple days)
- [ ] Route optimization suggestions
- [ ] Mobile-responsive design
- [ ] Field filtering by state/status

## Troubleshooting

### "Failed to connect to AirTable"

- Check that your API key is correctly set in environment variables
- Verify the API key has the required scopes
- Check browser console for detailed error messages

### Fields not showing on map

- Verify fields have valid `Latitude` and `Longitude` values in AirTable
- Check that the state filter in `/api/fields.js` includes your target states

### Changes not saving

- Ensure your API token has `data.records:write` scope
- Check browser console for API errors

## Security Notes

- API key is stored server-side only (in Vercel environment variables)
- API key is never exposed to the browser
- Recommend using read-only scope unless write access is needed
- Scope token to only the required base and tables
