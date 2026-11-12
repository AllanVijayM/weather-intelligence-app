import { WeatherData, Recommendation, ActivityScore, TemperatureUnit } from '../types/weather';

export function generateRecommendations(data: WeatherData, unit: TemperatureUnit): {
  recommendations: Recommendation[];
  activities: ActivityScore[];
  summaryText: string;
} {
  const current = data.current;
  const today = data.daily[0];
  const recs: Recommendation[] = [];

  const tempC = current.temperature;
  const apparentC = current.apparentTemperature;
  const precipProb = today?.precipitationProbabilityMax ?? (current.precipitation > 0 ? 90 : 10);
  const uvMax = today?.uvIndexMax ?? 0;
  const windKmh = current.windSpeed;
  const humidity = current.relativeHumidity;
  const code = current.weatherCode;

  // 1. Umbrella / Rain gear
  const isRaining = code >= 51 || current.precipitation > 0;
  if (isRaining || precipProb >= 50) {
    recs.push({
      id: 'umbrella',
      title: 'Umbrella Essential',
      category: 'gear',
      description: isRaining
        ? `Precipitation is actively falling in ${data.location.name}. Don't step outside without an umbrella or rain coat.`
        : `High probability of rain (${precipProb}%) expected today. Keep an umbrella handy in your bag.`,
      status: 'warning',
      icon: 'Umbrella',
      actionableText: 'Carry waterproof gear',
    });
  } else if (precipProb >= 25) {
    recs.push({
      id: 'umbrella-maybe',
      title: 'Subtle Rain Risk',
      category: 'gear',
      description: `Moderate chance of isolated showers (${precipProb}%). Packing a compact umbrella is recommended.`,
      status: 'caution',
      icon: 'Umbrella',
      actionableText: 'Pack light raincoat',
    });
  } else {
    recs.push({
      id: 'no-umbrella',
      title: 'No Umbrella Needed',
      category: 'gear',
      description: 'Dry atmospheric conditions expected. You can leave the rain gear at home.',
      status: 'positive',
      icon: 'Sun',
      actionableText: 'Enjoy dry sky',
    });
  }

  // 2. Sunscreen & UV Protection
  if (uvMax >= 6) {
    recs.push({
      id: 'sunscreen-high',
      title: 'High UV Protection Required',
      category: 'health',
      description: `Peak UV Index will reach ${uvMax.toFixed(1)} today. Apply SPF 30+ sunscreen, wear UV-blocking sunglasses and a hat.`,
      status: 'warning',
      icon: 'Sun',
      actionableText: 'Apply SPF 30+ & wear hat',
    });
  } else if (uvMax >= 3) {
    recs.push({
      id: 'sunscreen-mod',
      title: 'Moderate UV Exposure',
      category: 'health',
      description: `Peak UV Index of ${uvMax.toFixed(1)}. Apply sunscreen if spending more than 30 minutes in direct sunlight.`,
      status: 'caution',
      icon: 'Sun',
      actionableText: 'Apply SPF 15+ sunscreen',
    });
  } else {
    recs.push({
      id: 'uv-low',
      title: 'Low UV Radiation',
      category: 'health',
      description: `Peak UV Index is minimal (${uvMax.toFixed(1)}). Minimal sun exposure risk.`,
      status: 'positive',
      icon: 'SunDim',
      actionableText: 'Safe sun exposure',
    });
  }

  // 3. Apparel / Layering advice
  if (apparentC < 5) {
    recs.push({
      id: 'apparel-heavy',
      title: 'Heavy Thermal Outerwear',
      category: 'clothing',
      description: `Feels like ${Math.round(unit === 'F' ? (apparentC * 9)/5 + 32 : apparentC)}°. Wear a thick insulated coat, thermal layers, scarf, and warm gloves.`,
      status: 'warning',
      icon: 'Shirt',
      actionableText: 'Heavy winter coat & layers',
    });
  } else if (apparentC < 15) {
    recs.push({
      id: 'apparel-jacket',
      title: 'Jacket & Layering Recommended',
      category: 'clothing',
      description: `Cool conditions (${Math.round(unit === 'F' ? (apparentC * 9)/5 + 32 : apparentC)}°). A medium fleece jacket, cardigan, or sweater is ideal.`,
      status: 'caution',
      icon: 'Shirt',
      actionableText: 'Medium jacket or sweater',
    });
  } else if (apparentC <= 26) {
    recs.push({
      id: 'apparel-light',
      title: 'Comfortable Light Apparel',
      category: 'clothing',
      description: `Pleasant thermal range (${Math.round(unit === 'F' ? (apparentC * 9)/5 + 32 : apparentC)}°). T-shirt, light shirt, or breathable everyday attire.`,
      status: 'positive',
      icon: 'Shirt',
      actionableText: 'Breathable t-shirt or shirt',
    });
  } else {
    recs.push({
      id: 'apparel-hot',
      title: 'Lightweight & Moisture Wicking',
      category: 'clothing',
      description: `Warm to hot conditions (feels like ${Math.round(unit === 'F' ? (apparentC * 9)/5 + 32 : apparentC)}°). Wear light cotton/linen, stay hydrated, and seek shade.`,
      status: 'caution',
      icon: 'ThermometerSun',
      actionableText: 'Cool loose clothing & water',
    });
  }

  // 4. Wind Advisory
  if (windKmh > 35) {
    recs.push({
      id: 'wind-gale',
      title: 'High Wind Warning',
      category: 'alert',
      description: `Wind gusts active at ${Math.round(windKmh)} km/h. Secure loose outdoor furniture and exercise caution while driving high-profile vehicles.`,
      status: 'warning',
      icon: 'Wind',
      actionableText: 'Secure loose items outdoors',
    });
  }

  // 5. Activity Scores Calculation
  const activities: ActivityScore[] = [];

  // Running: best 12-20°C, low rain, wind < 25
  let runningScore = 10;
  if (tempC < 5 || tempC > 28) runningScore -= 3;
  else if (tempC < 10 || tempC > 24) runningScore -= 1;
  if (isRaining) runningScore -= 4;
  else if (precipProb > 40) runningScore -= 2;
  if (windKmh > 25) runningScore -= 2;
  if (humidity > 85) runningScore -= 1;
  runningScore = Math.max(1, Math.min(10, runningScore));
  activities.push({
    name: 'Outdoor Running',
    category: 'Fitness',
    score: runningScore,
    rating: getActivityRating(runningScore),
    reason: runningScore >= 8
      ? 'Optimal air temp and clear roads for distance running.'
      : isRaining ? 'Slippery pavement and rainfall lowers run comfort.' : 'Sub-optimal temperature or wind strength.',
    iconName: 'Footprints',
  });

  // Cycling: best 15-22°C, wind < 18 km/h, no rain
  let cyclingScore = 10;
  if (isRaining) cyclingScore -= 5;
  else if (precipProb > 30) cyclingScore -= 2;
  if (windKmh > 30) cyclingScore -= 4;
  else if (windKmh > 18) cyclingScore -= 2;
  if (tempC < 8 || tempC > 30) cyclingScore -= 2;
  cyclingScore = Math.max(1, Math.min(10, cyclingScore));
  activities.push({
    name: 'Road Cycling',
    category: 'Sports',
    score: cyclingScore,
    rating: getActivityRating(cyclingScore),
    reason: windKmh > 20
      ? `Strong headwinds (${Math.round(windKmh)} km/h) impact stability.`
      : isRaining ? 'Wet roads reduce tire traction.' : 'Favorable road conditions.',
    iconName: 'Bike',
  });

  // Outdoor Dining / Patio: best 18-26°C, no rain, wind < 15
  let diningScore = 10;
  if (isRaining) diningScore -= 6;
  else if (precipProb > 30) diningScore -= 3;
  if (tempC < 16 || tempC > 28) diningScore -= 3;
  if (windKmh > 20) diningScore -= 3;
  diningScore = Math.max(1, Math.min(10, diningScore));
  activities.push({
    name: 'Patio & Outdoor Dining',
    category: 'Leisure',
    score: diningScore,
    rating: getActivityRating(diningScore),
    reason: diningScore >= 8
      ? 'Delightful ambient temperature and calm breeze for outdoor seating.'
      : isRaining ? 'Rainfall requires indoor dining.' : 'Breezy or cool air.',
    iconName: 'Utensils',
  });

  // Hiking: best 14-24°C, low rain, clear skies
  let hikingScore = 10;
  if (isRaining) hikingScore -= 4;
  if (tempC < 5 || tempC > 30) hikingScore -= 3;
  if (windKmh > 30) hikingScore -= 2;
  hikingScore = Math.max(1, Math.min(10, hikingScore));
  activities.push({
    name: 'Trail Hiking',
    category: 'Adventure',
    score: hikingScore,
    rating: getActivityRating(hikingScore),
    reason: hikingScore >= 8
      ? 'Great visibility and trail surface stability.'
      : isRaining ? 'Muddy trails and reduced visibility.' : 'Temperature or wind friction present.',
    iconName: 'Mountain',
  });

  // Stargazing: Night / evening, low clouds (< 20%), no rain
  let stargazingScore = 10;
  const cloudCover = current.cloudCover;
  if (cloudCover > 60) stargazingScore -= 6;
  else if (cloudCover > 25) stargazingScore -= 3;
  if (isRaining) stargazingScore -= 5;
  if (tempC < 0) stargazingScore -= 2;
  stargazingScore = Math.max(1, Math.min(10, stargazingScore));
  activities.push({
    name: 'Night Stargazing',
    category: 'Astronomy',
    score: stargazingScore,
    rating: getActivityRating(stargazingScore),
    reason: cloudCover < 20
      ? 'Crystal clear celestial visibility with minimal cloud obstruction.'
      : `Cloud cover at ${cloudCover}% obscures astronomical views.`,
    iconName: 'Sparkles',
  });

  // Beach & Swimming: temp > 24°C, high UV, sunny
  let beachScore = 10;
  if (tempC < 22) beachScore -= 5;
  else if (tempC < 26) beachScore -= 2;
  if (isRaining) beachScore -= 6;
  if (cloudCover > 50) beachScore -= 3;
  beachScore = Math.max(1, Math.min(10, beachScore));
  activities.push({
    name: 'Beach & Watersports',
    category: 'Recreation',
    score: beachScore,
    rating: getActivityRating(beachScore),
    reason: tempC >= 25 && !isRaining
      ? 'Warm sun and high air temperature ideal for water activities.'
      : tempC < 22 ? 'Air temperature too cool for beach swimming.' : 'Cloudy or damp conditions.',
    iconName: 'Waves',
  });

  // Summary sentence
  let summaryText = `Current weather in ${data.location.name} features ${current.temperature.toFixed(1)}°C with ${humidity}% humidity and ${windKmh.toFixed(1)} km/h winds. `;
  if (isRaining) {
    summaryText += 'Plan indoor events or carry heavy rain protection.';
  } else if (apparentC >= 18 && apparentC <= 25 && precipProb < 20) {
    summaryText += 'Overall conditions are pleasant for outdoor leisure, running, and dining.';
  } else if (apparentC < 10) {
    summaryText += 'Bundle up warm with layers as chilly atmospheric winds lower thermal comfort.';
  } else {
    summaryText += 'Conditions are generally stable across the region.';
  }

  return { recommendations: recs, activities, summaryText };
}

function getActivityRating(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Fair';
  return 'Poor';
}
