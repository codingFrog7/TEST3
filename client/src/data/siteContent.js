import { CloudRain, CloudSun, Sun } from "lucide-react";

export const crops = [
  {
    name: "Chilli",
    local: "Mirchi",
    status: "Healthy",
    image:
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=900&q=85",
    note: "Watch new leaves for curling and pale patches.",
    season: "Kharif · 90–150 days",
    water: "Light, regular irrigation",
    symptoms: ["Leaf curl", "Whitefly", "Fruit rot"],
    actions: [
      "Inspect the underside of leaves twice a week.",
      "Keep the field free of volunteer plants.",
      "Avoid overhead irrigation when humidity is high.",
    ],
    expertTips: {
      status: "Healthy",
      priority: "Yield Optimization & Canopy Monitoring",
      stage: "Flowering & Early Pod Setting (45–75 DAT)",
      bestTiming: "Early morning (6:00 AM – 8:30 AM) before sun heat builds",
      summary:
        "Crop vegetative vigor is excellent with strong node density. Maintain balanced nutrition and monitor early thrips before flowering flush.",
      recommendations: [
        "Foliar boost: Spray 13:0:45 (Potassium Nitrate) @ 5g/L + micronutrient mix to prevent flower drop and promote uniform fruit elongation.",
        "Scouting cadence: Place 8-10 yellow and blue sticky traps per acre at crop canopy height to catch early winged thrips and whiteflies.",
        "Irrigation timing: Provide alternate furrow irrigation in the cool morning hours; avoid water standing more than 2 hours around root collars.",
      ],
      caution:
        "Do not over-apply high-nitrogen fertilizers now; excessive leafy growth attracts sucking pests and delays fruit pungency.",
    },
    historicalYields: [
      {
        year: "2021",
        yield: 18.4,
        benchmark: 16.2,
        rainfall: "820mm (Normal)",
        condition: "Favorable",
        note: "Mild pest incidence, good flowering",
      },
      {
        year: "2022",
        yield: 14.6,
        benchmark: 16.5,
        rainfall: "1,040mm (Excess)",
        condition: "Heavy Rain",
        note: "Late monsoon showers caused anthracnose and flower drop",
      },
      {
        year: "2023",
        yield: 17.8,
        benchmark: 16.9,
        rainfall: "690mm (Deficit)",
        condition: "Dry Spell",
        note: "Drip fertigation protected yield during 3-week dry period",
      },
      {
        year: "2024",
        yield: 20.2,
        benchmark: 17.3,
        rainfall: "880mm (Optimal)",
        condition: "Optimal",
        note: "IPM adoption and raised-bed planting boosted pod setting",
      },
      {
        year: "2025",
        yield: 22.1,
        benchmark: 17.7,
        rainfall: "910mm (Good)",
        condition: "High Vigor",
        note: "Record harvest with hybrid seed and bio-fungicide seed coating",
      },
    ],
  },
  {
    name: "Tomato",
    local: "Tamatar",
    status: "Watch",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=85",
    note: "Warm, humid weather can favour early blight.",
    season: "Rabi · 90–110 days",
    water: "Deep irrigation at soil level",
    symptoms: ["Early blight", "Bacterial spot", "Aphids"],
    actions: [
      "Remove badly affected leaves and destroy them away from the field.",
      "Use clean seed and give plants room for airflow.",
      "Ask a local agriculture officer before using a pesticide.",
    ],
    expertTips: {
      status: "Watch",
      priority: "Active Disease Suppression & Pruning",
      stage: "Vegetative to Fruit Development (35–65 DAT)",
      bestTiming:
        "Dry morning hours after dew has completely evaporated (8:00 AM – 10:30 AM)",
      summary:
        "Watch status active due to high relative humidity (>75%) promoting concentric leaf spot (Alternaria) on lower foliage.",
      recommendations: [
        "Sanitation pruning: Strip off lower diseased leaves up to 20cm above the soil line and bury them outside the field boundary.",
        "Protective spray: Apply copper oxychloride (COC 50% WP) @ 2.5g/L or bio-agent Trichoderma viride @ 5g/L directly to stems and lower canopy.",
        "Staking & Airflow: Tie loose branches to trellis wire or bamboo stakes to prevent fruit from contacting wet soil.",
      ],
      caution:
        "Never use overhead sprinkler irrigation when early blight lesions are visible; water splash spreads spores across adjacent healthy rows.",
    },
    historicalYields: [
      {
        year: "2021",
        yield: 24.8,
        benchmark: 22.1,
        rainfall: "810mm (Normal)",
        condition: "Favorable",
        note: "Stable season with strong trellis support",
      },
      {
        year: "2022",
        yield: 20.5,
        benchmark: 22.4,
        rainfall: "1,020mm (Excess)",
        condition: "Heavy Rain",
        note: "Early blight outbreak in October caused 15% leaf loss",
      },
      {
        year: "2023",
        yield: 26.4,
        benchmark: 23.0,
        rainfall: "670mm (Deficit)",
        condition: "Dry Spell",
        note: "Silver-black mulch retained moisture and kept fruit clean",
      },
      {
        year: "2024",
        yield: 28.5,
        benchmark: 23.6,
        rainfall: "860mm (Optimal)",
        condition: "Optimal",
        note: "Bio-rational sprays and pheromone traps eliminated fruit borer",
      },
      {
        year: "2025",
        yield: 30.2,
        benchmark: 24.1,
        rainfall: "895mm (Good)",
        condition: "High Vigor",
        note: "Excellent cluster formation and extended harvesting window",
      },
    ],
  },
  {
    name: "Cotton",
    local: "Kapas",
    status: "Healthy",
    image:
      "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=900&q=85",
    note: "Good sunlight today. Keep scouting for sucking pests.",
    season: "Kharif · 160–180 days",
    water: "Avoid waterlogging",
    symptoms: ["Jassid", "Pink bollworm", "Leaf reddening"],
    actions: [
      "Check five plants at five spots in the field.",
      "Protect flowering stages from unnecessary spray.",
      "Use pheromone traps where recommended locally.",
    ],
    expertTips: {
      status: "Healthy",
      priority: "Sucking Pest Surveillance & Boll Nutrition",
      stage: "Square Formation & Peak Flowering (60–90 DAS)",
      bestTiming:
        "Late afternoon (4:00 PM – 6:00 PM) or early morning before breeze picks up",
      summary:
        "Crop stands in prime health with uniform square formation. Protect early beneficial insects like ladybird beetles and lacewings.",
      recommendations: [
        "Pheromone trapping: Install 4-5 Pheromone traps per acre with Gossyplure septa to monitor Pink Bollworm moths. Count catches weekly.",
        "Micronutrient foliar: Spray 1% Magnesium Sulphate + 0.5% Zinc Sulphate to eliminate physiological leaf reddening in black cotton soil.",
        "Scouting rule: Inspect 20 plants randomly; only act if sucking pest counts exceed 5 jassids/leaf or 10 thrips/leaf.",
      ],
      caution:
        "Avoid broad-spectrum synthetic pyrethroid sprays early in the season; they trigger secondary whitefly resurgences.",
    },
    historicalYields: [
      {
        year: "2021",
        yield: 19.8,
        benchmark: 17.8,
        rainfall: "840mm (Normal)",
        condition: "Favorable",
        note: "Healthy boll load and clean lint harvest",
      },
      {
        year: "2022",
        yield: 16.1,
        benchmark: 18.0,
        rainfall: "1,110mm (Excess)",
        condition: "Heavy Rain",
        note: "Waterlogging caused square shedding and parawilt",
      },
      {
        year: "2023",
        yield: 20.3,
        benchmark: 18.4,
        rainfall: "650mm (Deficit)",
        condition: "Dry Spell",
        note: "Deep taproot system efficiently tapped subsoil moisture",
      },
      {
        year: "2024",
        yield: 22.7,
        benchmark: 18.9,
        rainfall: "880mm (Optimal)",
        condition: "Optimal",
        note: "High boll retention after targeted neem-based early spray",
      },
      {
        year: "2025",
        yield: 24.2,
        benchmark: 19.3,
        rainfall: "920mm (Good)",
        condition: "High Vigor",
        note: "Superior staple length and minimal pink bollworm damage",
      },
    ],
  },
  {
    name: "Wheat",
    local: "Gehu",
    status: "Healthy",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85",
    note: "Keep an eye on rust if cool, wet weather arrives.",
    season: "Rabi · 120–150 days",
    water: "Timely irrigation at critical stages",
    symptoms: ["Yellow rust", "Aphids", "Loose smut"],
    actions: [
      "Use certified seed when starting a new crop.",
      "Walk across the field before deciding on treatment.",
      "Harvest and dry grain properly to prevent storage losses.",
    ],
    expertTips: {
      status: "Healthy",
      priority: "Crown Root Irrigation & Tiller Protection",
      stage: "Tillering & Jointing Stage (25–50 DAS)",
      bestTiming:
        "Morning calm (7:00 AM – 9:30 AM) to evaluate dew persistence on leaves",
      summary:
        "High tiller count observed. Current cool nights favor vegetative tillering. Maintain strict vigil for early yellow rust stripes.",
      recommendations: [
        "Crown root irrigation: Ensure light, uniform watering at CRI stage (21 days after sowing); avoid submerged standing water.",
        "Nitrogen split: Top-dress second split of Urea (30 kg N/acre) just before irrigation for rapid root uptake.",
        "Rust surveillance: Walk diagonally across field. If powdery yellow pustules appear on upper leaves, alert the local agronomist immediately.",
      ],
      caution:
        "Delaying first irrigation beyond 25 days severely restricts secondary root development and stunts tiller capacity.",
    },
    historicalYields: [
      {
        year: "2021",
        yield: 38.6,
        benchmark: 35.2,
        rainfall: "85mm (Winter)",
        condition: "Favorable",
        note: "Extended cold winter aided grain filling",
      },
      {
        year: "2022",
        yield: 33.4,
        benchmark: 35.6,
        rainfall: "30mm (Dry)",
        condition: "Heat Spell",
        note: "Terminal heat spike in March shriveled late grains",
      },
      {
        year: "2023",
        yield: 38.1,
        benchmark: 36.1,
        rainfall: "75mm (Winter)",
        condition: "Normal Chill",
        note: "Timely sowing and balanced zinc-urea application",
      },
      {
        year: "2024",
        yield: 41.5,
        benchmark: 36.8,
        rainfall: "95mm (Optimal)",
        condition: "Optimal",
        note: "Zero-tillage sowing retained optimal soil moisture",
      },
      {
        year: "2025",
        yield: 43.8,
        benchmark: 37.4,
        rainfall: "105mm (Good)",
        condition: "High Vigor",
        note: "Bio-fortified seed variety yielded robust 48 grains per earhead",
      },
    ],
  },
];

export const weatherDays = [
  {
    day: "Today",
    icon: Sun,
    high: "31°",
    low: "24°",
    rain: "10%",
    label: "Sunny",
    wind: "12 km/h",
    humidity: "58%",
  },
  {
    day: "Tue",
    icon: CloudSun,
    high: "30°",
    low: "23°",
    rain: "20%",
    label: "Partly cloudy",
    wind: "14 km/h",
    humidity: "62%",
  },
  {
    day: "Wed",
    icon: CloudRain,
    high: "28°",
    low: "23°",
    rain: "60%",
    label: "Heavy rain",
    wind: "24 km/h",
    humidity: "86%",
  },
  {
    day: "Thu",
    icon: CloudSun,
    high: "29°",
    low: "22°",
    rain: "35%",
    label: "Scattered showers",
    wind: "16 km/h",
    humidity: "74%",
  },
  {
    day: "Fri",
    icon: Sun,
    high: "32°",
    low: "24°",
    rain: "10%",
    label: "Sunny",
    wind: "11 km/h",
    humidity: "54%",
  },
];

export const weatherScenarios = {
  forecast: {
    id: "forecast",
    name: "Current Forecast (Rain Alert)",
    days: weatherDays,
  },
  heavyRain: {
    id: "heavyRain",
    name: "Extreme Heavy Rainfall",
    days: [
      {
        day: "Today",
        icon: CloudRain,
        high: "27°",
        low: "22°",
        rain: "85%",
        label: "Severe rain",
        wind: "28 km/h",
        humidity: "92%",
      },
      {
        day: "Tue",
        icon: CloudRain,
        high: "26°",
        low: "21°",
        rain: "90%",
        label: "Torrential downpour",
        wind: "32 km/h",
        humidity: "95%",
      },
      {
        day: "Wed",
        icon: CloudRain,
        high: "27°",
        low: "22°",
        rain: "75%",
        label: "Heavy rain",
        wind: "25 km/h",
        humidity: "89%",
      },
      {
        day: "Thu",
        icon: CloudSun,
        high: "29°",
        low: "23°",
        rain: "40%",
        label: "Passing rain",
        wind: "18 km/h",
        humidity: "76%",
      },
      {
        day: "Fri",
        icon: Sun,
        high: "31°",
        low: "24°",
        rain: "15%",
        label: "Clearing",
        wind: "12 km/h",
        humidity: "65%",
      },
    ],
  },
  frostCold: {
    id: "frostCold",
    name: "Frost & Cold Wave Risk",
    days: [
      {
        day: "Today",
        icon: Sun,
        high: "21°",
        low: "8°",
        rain: "0%",
        label: "Dry chill",
        wind: "15 km/h",
        humidity: "38%",
      },
      {
        day: "Tue",
        icon: Sun,
        high: "19°",
        low: "4°",
        rain: "5%",
        label: "Severe ground frost",
        wind: "18 km/h",
        humidity: "34%",
      },
      {
        day: "Wed",
        icon: CloudSun,
        high: "20°",
        low: "5°",
        rain: "0%",
        label: "Frost hazard",
        wind: "12 km/h",
        humidity: "40%",
      },
      {
        day: "Thu",
        icon: Sun,
        high: "22°",
        low: "7°",
        rain: "0%",
        label: "Cold morning",
        wind: "10 km/h",
        humidity: "42%",
      },
      {
        day: "Fri",
        icon: Sun,
        high: "24°",
        low: "10°",
        rain: "0%",
        label: "Milder",
        wind: "9 km/h",
        humidity: "45%",
      },
    ],
  },
  heatwave: {
    id: "heatwave",
    name: "Extreme Heatwave",
    days: [
      {
        day: "Today",
        icon: Sun,
        high: "39°",
        low: "27°",
        rain: "0%",
        label: "Intense heat",
        wind: "16 km/h",
        humidity: "28%",
      },
      {
        day: "Tue",
        icon: Sun,
        high: "42°",
        low: "29°",
        rain: "0%",
        label: "Severe heatwave",
        wind: "22 km/h",
        humidity: "22%",
      },
      {
        day: "Wed",
        icon: Sun,
        high: "41°",
        low: "28°",
        rain: "5%",
        label: "Heatwave",
        wind: "19 km/h",
        humidity: "24%",
      },
      {
        day: "Thu",
        icon: CloudSun,
        high: "38°",
        low: "26°",
        rain: "10%",
        label: "Hot & dry",
        wind: "14 km/h",
        humidity: "32%",
      },
      {
        day: "Fri",
        icon: Sun,
        high: "37°",
        low: "25°",
        rain: "10%",
        label: "Sunny",
        wind: "12 km/h",
        humidity: "35%",
      },
    ],
  },
};

/**
 * Dynamically evaluate extreme weather hazards based on the 5-day forecast
 */
export function evaluateWeatherAlerts(days = weatherDays) {
  const alerts = [];

  // Check for Heavy Rainfall
  const rainDay = days.find(d => {
    const pct = parseInt(d.rain, 10) || 0;
    return (
      pct >= 50 ||
      d.label.toLowerCase().includes("heavy") ||
      d.label.toLowerCase().includes("torrential")
    );
  });

  if (rainDay) {
    alerts.push({
      type: "heavy_rain",
      severity: "warning",
      title: `HEAVY RAINFALL ALERT: ${rainDay.day} (${rainDay.rain} probability)`,
      event: "Heavy Precipitation & Soil Waterlogging Risk",
      triggerDay: rainDay.day,
      metric: `${rainDay.rain} rain risk`,
      icon: "CloudRain",
      urgency: "HIGH ACTION REQUIRED",
      message:
        "Anticipated rainfall can saturate topsoil and flood furrow depressions, leading to root asphyxiation and collar rot.",
      actionPoints: [
        "Inspect and clear drainage outlets at lower field boundaries immediately.",
        "Postpone any planned pesticide spray or urea top-dressing to prevent chemical runoff.",
        "Erect soil bund supports around nursery vegetable beds to deflect storm surface wash.",
      ],
      color: "blue",
    });
  }

  // Check for Frost / Cold Wave (low <= 6°C is severe, <= 10°C is moderate frost/cold shock)
  const coldDay = days.find(d => {
    const lowTemp = parseInt(d.low, 10);
    return !isNaN(lowTemp) && lowTemp <= 9;
  });

  if (coldDay) {
    const lowVal = parseInt(coldDay.low, 10);
    const isSevere = lowVal <= 5;
    alerts.push({
      type: "frost",
      severity: isSevere ? "danger" : "warning",
      title: `${isSevere ? "CRITICAL GROUND FROST ALERT" : "COLD WAVE & CHILL STRESS"}: ${coldDay.day} (Low: ${coldDay.low})`,
      event: "Low Night Temperatures & Frost Hazard",
      triggerDay: coldDay.day,
      metric: `Min temp ${coldDay.low}`,
      icon: "Snowflake",
      urgency: isSevere
        ? "IMMEDIATE PROTECTION NEEDED"
        : "NIGHTTIME FIELD ADVISORY",
      message:
        "Sub-10°C night temperatures cause cellular frost damage in tender vegetables, chill-injury in young seedlings, and flower blighting.",
      actionPoints: [
        "Run light evening furrow irrigation — moist soil holds and radiates significantly more night warmth than dry soil.",
        "Cover delicate nursery rows or tomato beds with temporary straw mulch or agri-film sheets before sunset.",
        "Create perimeter bio-smoke (smudge fires using damp straw) between 4:00 AM and 6:00 AM if temperatures plunge below 4°C.",
      ],
      color: "frost",
    });
  }

  // Check for Extreme Heatwave (high >= 38°C)
  const hotDay = days.find(d => {
    const highTemp = parseInt(d.high, 10);
    return !isNaN(highTemp) && highTemp >= 38;
  });

  if (hotDay) {
    alerts.push({
      type: "heatwave",
      severity: "warning",
      title: `EXTREME HEATWAVE ADVISORY: ${hotDay.day} (Peak: ${hotDay.high})`,
      event: "Intense Heat & Accelerated Evapotranspiration",
      triggerDay: hotDay.day,
      metric: `Peak temp ${hotDay.high}`,
      icon: "ThermometerSun",
      urgency: "EVAPORATION MITIGATION",
      message:
        "Extreme afternoon heat leads to blossom drop in chillies and premature moisture stress in young cotton.",
      actionPoints: [
        "Shift irrigation to early dawn (5:00 AM – 7:30 AM); avoid midday water application that boils roots.",
        "Spread organic paddy straw mulch (5cm depth) over crop root zones to conserve soil moisture.",
        "Avoid heavy fertilizer salts; spray 1% Potassium Nitrate foliar in cool morning to regulate plant stomata.",
      ],
      color: "amber",
    });
  }

  return alerts;
}

export const advisoryCards = [
  {
    tag: "CHILLI",
    title: "Check leaves before the heat builds",
    body: "Curling leaves can have more than one cause. Look for insects under the leaf, check soil moisture, and take a clear photo before treating.",
    color: "green",
    time: "3 min read",
  },
  {
    tag: "ALL CROPS",
    title: "A simple IPM routine for every field",
    body: "Scout first, use field hygiene and natural controls where practical, and use a locally approved product only when it is needed and labelled for your crop.",
    color: "ochre",
    time: "5 min read",
  },
  {
    tag: "WEATHER",
    title: "Rain in the next 48 hours?",
    body: "Finish weeding and avoid spraying before rain. Clear blocked drainage and postpone foliar feeding until leaves can stay dry.",
    color: "blue",
    time: "2 min read",
  },
];
