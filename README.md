# Weather Intelligence Dashboard

A modern, responsive **Weather Intelligence** web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

> **No API Keys Required:** This application uses **public Open-Meteo APIs** directly from the browser (`fetch`) and **does not require private API keys, OAuth tokens, backend servers, or paid subscriptions**.

---

## 1. Project Overview

**Weather Intelligence Dashboard** provides real-time weather conditions, a 7-day interactive forecast, 24-hour and multi-day data visualizations, and weather-aware gear & outdoor activity recommendations for any city worldwide.

On initial launch, the app opens with a clean search prompt and quick-access global city chips—no default city data is preloaded until you search for and select a location. All user preferences (temperature units, wind speed units, Light/Dark theme, recent searches, and saved favorite cities) are persisted locally in the browser via `localStorage`.

---

## 2. Application Features

- **Global City Search & Autocomplete**
  - Debounced live city search powered by Open-Meteo Geocoding with keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
  - Smart selection behavior: partial queries (e.g., 2 letters) keep the dropdown list open for selection rather than auto-picking the top result; pressing `Enter` auto-selects only on an exact city-name match or a highlighted dropdown item.
  - Quick-access **Popular Cities** chips and persisted **Recent Searches** history.
- **Current Weather Intelligence Card**
  - Dynamic weather condition badges and atmospheric styling (Clear, Cloudy, Rain, Storm, Snow, Fog).
  - Live ambient temperature, "Feels like" apparent temperature, daily high/low, humidity, wind speed & compass direction, surface/sea-level pressure, UV index, cloud cover, and sunrise/sunset schedule.
  - Live local clock adjusted to the selected city's timezone.
- **7-Day Interactive Forecast**
  - Daily condition icon, precipitation probability, min/max temperatures, and a temperature **Degree bar scale** with explicit `Start` and `End` indicators showing where each day's range sits relative to the week's overall temperature span.
  - Clicking any day updates the hourly charts to inspect that specific day.
- **Interactive Weather Charts**
  - **24-Hr Temp**: Smooth SVG temperature curve with hover inspection tooltips (time, temp, rain chance, condition).
  - **7-Day High/Low**: Dual trend lines comparing daily maximum and minimum temperatures across the week.
  - **Rain & Humidity**: Hourly precipitation probability bar breakdown.
  - **UV & Wind**: Hourly wind speed trend visualization.
- **Smart Recommendations & Activity Scores**
  - Actionable gear & apparel checklist (umbrella alerts, UV/sunscreen advice, layering guidance).
  - Real-time 1–10 suitability scores for outdoor activities (Running, Cycling, Trail Hiking, Outdoor Dining, Stargazing, Beach & Watersports).
- **Controls, Personalization & Responsiveness**
  - Temperature toggle (`°C` / `°F`), wind speed unit toggle (`km/h` / `mph` / `m/s`), and **Light / Dark** theme toggle.
  - **Saved Locations** drawer for bookmarking and switching between favorite cities.
  - Fully responsive layout across mobile, tablet, and widescreen desktop viewports, with skeleton loading states and recoverable error screens.

---

## 3. Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling & Icons**: Tailwind CSS v4 (`@tailwindcss/vite`) + Lucide React
- **Data Layer**: Native browser `fetch` against public Open-Meteo REST APIs
- **State Persistence**: Browser `localStorage` (saved cities, recent searches, theme, units)
- **Static Hosting**: Ready for Cloudflare Pages (includes `public/_redirects` for SPA routing)

---

## 4. Open-Meteo Geocoding API Details

City lookup and coordinate resolution use the public **Open-Meteo Geocoding API** (`src/services/openMeteoApi.ts`):

- **Base Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
- **Authentication**: None (public endpoint, no API key required)
- **Query Parameters**:
  - `name` — URL-encoded city search string (minimum 2 characters)
  - `count=10` — Maximum number of matching locations returned
  - `language=en` — Language for location names
  - `format=json` — JSON response format
- **Example Request**:
  ```text
  https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=10&language=en&format=json
  ```
- **Data Used**: `id`, `name`, `latitude`, `longitude`, `elevation`, `country_code`, `admin1`, `country`, `timezone`, and `population`.

---

## 5. Open-Meteo Forecast API Details

Weather telemetry and forecasts use the public **Open-Meteo Forecast API** (`src/services/openMeteoApi.ts`):

- **Base Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Authentication**: None (public endpoint, no API key required)
- **Query Parameters**:
  - `latitude` & `longitude` — Coordinates from the selected location
  - `timezone` — Location IANA timezone (falls back to `auto`)
  - `current` — `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `is_day`, `precipitation`, `rain`, `showers`, `snowfall`, `weather_code`, `cloud_cover`, `pressure_msl`, `surface_pressure`, `wind_speed_10m`, `wind_direction_10m`, `wind_gusts_10m`
  - `hourly` — `temperature_2m`, `relative_humidity_2m`, `dew_point_2m`, `apparent_temperature`, `precipitation_probability`, `precipitation`, `weather_code`, `surface_pressure`, `cloud_cover`, `visibility`, `wind_speed_10m`, `uv_index`
  - `daily` — `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `apparent_temperature_max`, `apparent_temperature_min`, `sunrise`, `sunset`, `uv_index_max`, `precipitation_sum`, `rain_sum`, `showers_sum`, `snowfall_sum`, `precipitation_hours`, `precipitation_probability_max`, `wind_speed_10m_max`, `wind_gusts_10m_max`, `wind_direction_10m_dominant`
- **Example Request**:
  ```text
  https://api.open-meteo.com/v1/forecast?latitude=35.6762&longitude=139.6503&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo
  ```

---

## 6. Install Dependencies

Ensure **Node.js** (v18+ recommended) and **npm** are installed, then install project dependencies:

```bash
npm install
```

---

## 7. Run Locally

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

You can also run TypeScript type-checking with:

```bash
npm run lint
```

---

## 8. Build for Production

Compile and bundle the production static assets:

```bash
npm run build
```

---

## 9. Build Output Directory

Running `npm run build` outputs the compiled static site (HTML, CSS, JS, and `public/_redirects`) into:

```text
dist/
```

---

## 10. Connect Google AI Studio to GitHub

To publish your Google AI Studio project to a GitHub repository:

1. Open your project in **Google AI Studio**.
2. Click the **GitHub** (or **Export / Save to GitHub**) icon in the top toolbar of the workspace.
3. Authorize Google AI Studio to access your GitHub account if prompted.
4. Choose to **Create a new repository** (or select an existing repository), enter a repository name and visibility (`Public` or `Private`), and confirm.
5. Push/commit your workspace files to the repository. Verify on GitHub that `package.json`, `vite.config.ts`, `index.html`, `public/_redirects`, and `src/` are present on your main branch.

*(Alternatively, you can download the project ZIP from AI Studio, initialize Git locally with `git init`, and push to a new GitHub repository with `git push -u origin main`.)*

---

## 11. Connect the GitHub Repository to Cloudflare Pages

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, go to **Workers & Pages**.
3. Click **Create** (or **Create application**) and switch to the **Pages** tab.
4. Under **Import an existing Git repository**, click **Connect to Git**.
5. Authorize Cloudflare Pages to access your GitHub account and select your Weather Intelligence repository.
6. Click **Begin setup** to configure the build settings.

---

## 12. Cloudflare Pages Build Command & Output Directory

Configure the deployment settings on Cloudflare Pages as follows:

- **Production branch**: `main` (or your default branch)
- **Framework preset**: `Vite`
- **Build command**:
  ```text
  npm run build
  ```
- **Build output directory**:
  ```text
  dist
  ```
- **Environment variables**: **None required** (this app uses public Open-Meteo APIs and requires no API keys).

Click **Save and Deploy**. Cloudflare Pages will install dependencies, run `npm run build`, and publish the `dist/` directory to a `*.pages.dev` URL.

> **SPA Routing Support**: The repository includes `public/_redirects` (`/*  /index.html  200`), which Vite copies into `dist/_redirects` during build so browser refreshes resolve cleanly without 404 errors.

---

## 13. Validate the Deployed Application

Once Cloudflare Pages finishes deploying, open your live `*.pages.dev` URL and verify the following:

1. **Initial Load State**: Confirm the header, search bar, and Popular Cities chips render cleanly with no preloaded city weather until a city is selected.
2. **Search & Exact-Match Behavior**:
   - Type 2–3 letters (e.g., `Lo`) and press `Enter`—verify the dropdown stays open rather than auto-picking the first result.
   - Click a city from the dropdown or type an exact city name (e.g., `Tokyo`) and press `Enter`—verify the full dashboard loads.
3. **Weather Data & Visual Components**:
   - Check that the Current Weather card, 7-Day Forecast (including the `Start` to `End` degree bar scale), Interactive Weather Charts (all 4 tabs), and Recommendations cards populate with live data.
   - Click different days in the 7-day forecast to confirm the 24-hour chart updates.
4. **Controls & Persistence**:
   - Toggle `°C` / `°F`, wind speed units (`km/h`, `mph`, `m/s`), and Light / Dark mode.
   - Bookmark a city, reload the page, and confirm saved cities and preferences persist via `localStorage`.
5. **Network & Console Health**:
   - Open browser DevTools (**Network** and **Console** tabs), search a city, and confirm `200 OK` responses from `geocoding-api.open-meteo.com` and `api.open-meteo.com` with zero API key errors or uncaught exceptions.
6. **Responsive Layout**:
   - Test both desktop full-screen and mobile viewports (e.g., `375px` width) to verify all header buttons, search controls, and charts render without overlapping or clipping.

---

## License

Apache-2.0
