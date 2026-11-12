# Weather Intelligence Dashboard

A complete, modern, responsive Weather Intelligence web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

The application operates using public [Open-Meteo APIs](https://open-meteo.com/). It requires **no API keys, no backend servers, no Firebase, and no paid services**.

---

## Features

1. **City Search & Geocoding**
   - Search any city globally by name with instant autocomplete suggestions.
   - Converts city search inputs into latitude and longitude using the Open-Meteo Geocoding API.
   - Quick search chips for major global cities and saved search history.

2. **Current Weather Intelligence**
   - Real-time ambient temperature & apparent temperature ("Feels like").
   - Relative humidity, wind speed & direction, atmospheric pressure, UV index, cloud cover, and solar arch (sunrise/sunset schedule).
   - Dynamic atmospheric color theme matching weather conditions (Clear, Rainy, Stormy, Snow, Overcast).

3. **7-Day Weather Forecast**
   - 7-day daily forecast displaying date, min/max temperatures with visual range bars, precipitation probability, and weather condition icons.
   - Interactive day selection to examine hourly forecast breakdowns for specific days.

4. **Interactive Weather Charts**
   - 24-Hour hourly temperature curve with smooth SVG rendering and hover tooltips.
   - 7-Day daily max & min temperature trend lines.
   - Precipitation & humidity distribution views.
   - UV index & wind speed trend charts.

5. **Smart Weather Recommendations**
   - Gear & Apparel checklist: Umbrella alerts, Sunscreen & UV advice, clothing & layering suggestions based on actual weather conditions.
   - Outdoor Activity Ratings: Real-time suitability scores (1-10) for Outdoor Running, Cycling, Trail Hiking, Outdoor Dining, Stargazing, and Beach & Watersports.

6. **Error Handling & UX Polish**
   - Skeleton loading states.
   - Friendly error messages for unknown cities or network issues with quick recovery options.
   - Temperature (°C / °F) and Wind Speed (km/h, mph, m/s) unit toggles.
   - Light / Dark mode toggle.
   - Saved favorite locations persisted in `localStorage`.

---

## Technical Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Data Source**: Open-Meteo Geocoding API & Open-Meteo Forecast API
- **Deployment**: Configured for static web hosting on Cloudflare Pages or Vercel/Netlify

---

## Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
The compiled production bundle will be generated in the `dist/` directory.

---

## Static Hosting Deployment (Cloudflare Pages)

This application is ready for static web deployment on **Cloudflare Pages**:

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git** (or upload assets directly).
3. Set the build configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Deploy site.

### SPA Routing & Browser Refresh Support
The project includes a `public/_redirects` file:
```text
/*  /index.html  200
```
This ensures that page reloads or deep links render `index.html` without 404 routing errors on Cloudflare Pages.

---

## License

Apache-2.0
