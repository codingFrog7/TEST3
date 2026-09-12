export const DISEASE_DATABASE = {
  Chilli: [
    {
      id: "chilli-curl",
      name: "Chilli Leaf Curl Virus",
      localName: "మిర్చి ఆకు ముడుత / मिर्च मरोड़िया",
      scientificName: "Chilli leaf curl virus (Begomovirus)",
      type: "Viral Infection (Vector-borne)",
      confidence: 96.4,
      severity: 3,
      severityLabel: "Moderate Leaf Puckering",
      vector: "Whitefly (Bemisia tabaci)",
      sampleImg:
        "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Upward curling and puckering of leaf margins into a boat shape",
        "Vein thickening and enations on the lower leaf surface",
        "Shortened internodes with stunted bushy plant growth",
        "Flower drop and small, deformed chilli pods",
      ],
      organicRemedy:
        "Spray Neem Oil 3000 ppm @ 5 ml/L water with 1 ml liquid soap. Install 12 yellow sticky traps per acre to capture whiteflies.",
      chemicalRemedy:
        "Acetamiprid 20% SP @ 0.4 g/L or Diafenthiuron 50% WP @ 1.2 g/L water. Alternate with Spiromesifen 22.9% SC @ 1 ml/L.",
      culturalTips:
        "Remove Parthenium and Abutilon weed hosts from bunds. Intercrop 2 border rows of Maize/Sorghum as a live barrier.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Early Morning (6:30 AM – 9:30 AM)",
    },
    {
      id: "chilli-anthracnose",
      name: "Anthracnose / Fruit Rot (Dieback)",
      localName: "కొమ్మ ఎండు తెగులు / फल सड़न",
      scientificName: "Colletotrichum capsici",
      type: "Fungal Pathogen",
      confidence: 94.2,
      severity: 2,
      severityLabel: "Early Spotting",
      vector: "Rain splash & air-borne spores",
      sampleImg:
        "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Circular sunken necrotic dark spots on ripening chillies",
        "Concentric rings of black acervuli within lesions",
        "Dieback starting from top shoot tips advancing downwards",
      ],
      organicRemedy:
        "Seed treatment with Trichoderma viride @ 10 g/kg seed. Foliar spray of Pseudomonas fluorescens @ 5 g/L water.",
      chemicalRemedy:
        "Azoxystrobin 23% SC @ 1 ml/L or Mancozeb 75% WP @ 2.5 g/L water. Repeat at 12-day intervals.",
      culturalTips:
        "Avoid overhead sprinkler irrigation during pod set. Collect and incinerate infected fruit mummies.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Late Afternoon (4:00 PM – 6:00 PM)",
    },
  ],
  Cotton: [
    {
      id: "cotton-bollworm",
      name: "Pink Bollworm Infestation",
      localName: "గులాబీ రంగు కాయ తొలుచు పురుగు / गुलाबी सुंडी",
      scientificName: "Pectinophora gossypiella",
      type: "Lepidopteran Insect Pest",
      confidence: 97.1,
      severity: 4,
      severityLabel: "Critical Economic Threshold",
      vector: "Nocturnal moth oviposition",
      sampleImg:
        "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Rosetted flowers with twisted petals preventing full bloom",
        "Microscopic entry holes in young developing green bolls",
        "Discolored, chewed seeds inside locules with stained lint",
      ],
      organicRemedy:
        "Install 5 Pheromone traps/acre for surveillance, 15/acre for mass trapping. Release Trichogramma bactrae egg parasitoids @ 60,000/acre.",
      chemicalRemedy:
        "Profenofos 50% EC @ 2 ml/L or Emamectin Benzoate 5% SG @ 0.5 g/L. In heavy attack: Chlorantraniliprole 18.5% SC @ 0.3 ml/L.",
      culturalTips:
        "Terminate cotton crop within 150-160 days (no ratoon crop). Promptly shred and bury crop residues after final harvest.",
      waterVolume: "200–250 Litres / Acre",
      bestSprayTime: "Evening dusk (5:00 PM onwards when moths emerge)",
    },
  ],
  Tomato: [
    {
      id: "tomato-early-blight",
      name: "Tomato Early Blight",
      localName: "ముందస్తు ఆకు తెగులు / अगेती झुलसा",
      scientificName: "Alternaria solani",
      type: "Fungal Foliar Disease",
      confidence: 95.8,
      severity: 3,
      severityLabel: "Concentric Target Rings",
      vector: "Soil-borne spores & splash rain",
      sampleImg:
        "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Dark brown circular spots with characteristic concentric target-board rings",
        "Yellow chlorotic halo surrounding lesions on older bottom foliage",
        "Lower leaf defoliation exposing fruit to sunscald",
      ],
      organicRemedy:
        "Mulch soil surface with paddy straw to prevent rain-splash from soil. Spray Trichoderma harzianum @ 5 g/L water.",
      chemicalRemedy:
        "Chlorothalonil 75% WP @ 2 g/L or Difenoconazole 25% EC @ 1 ml/L water.",
      culturalTips:
        "Prune lower 12 inches of foliage to enhance airflow. Stake plants and avoid overhead wetting.",
      waterVolume: "150–200 Litres / Acre",
      bestSprayTime: "Morning (7:00 AM – 10:00 AM)",
    },
  ],
  Paddy: [
    {
      id: "paddy-blb",
      name: "Bacterial Leaf Blight (BLB)",
      localName: "వరి ఎండ్ర తెగులు / जीवाणु पत्ती झुलसा",
      scientificName: "Xanthomonas oryzae pv. oryzae",
      type: "Bacterial Vascular Disease",
      confidence: 96.0,
      severity: 3,
      severityLabel: "Wavy Marginal Necrosis",
      vector: "Irrigation water currents & typhoon winds",
      sampleImg:
        "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Water-soaked lesions starting at leaf margins near the tip",
        "Lesions turn wavy yellow-white and progress down leaf blade",
        "Ooze droplets visible on young lesions in humid mornings",
      ],
      organicRemedy:
        "Apply bleaching powder @ 2 kg/acre in standing irrigation water. Spray Pseudomonas fluorescens @ 2.5 kg/ha.",
      chemicalRemedy:
        "Copper Hydroxide 77% WP @ 2 g/L + Kasugamycin 3% SL @ 2 ml/L water.",
      culturalTips:
        "Immediately suspend top-dressing of nitrogen/urea. Practice Alternate Wetting & Drying (AWD).",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Early Morning",
    },
  ],
  Wheat: [
    {
      id: "wheat-rust",
      name: "Yellow / Stripe Rust",
      localName: "పసుపు కుంకుమ తెగులు / पीला रतुआ",
      scientificName: "Puccinia striiformis f. sp. tritici",
      type: "Airborne Fungal Rust",
      confidence: 97.4,
      severity: 4,
      severityLabel: "Active Linear Pustules",
      vector: "Long-distance wind currents",
      sampleImg:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Bright yellow, narrow powdery pustules arranged in parallel stripes",
        "Leaf blades turn yellow, dry up and feel like scorched paper",
        "Yellow spore powder rubs off easily onto hands and clothes",
      ],
      organicRemedy:
        "Early sowing of rust-resistant varieties. Foliar spray of fermented sour buttermilk @ 5% concentration.",
      chemicalRemedy:
        "Propiconazole 25% EC (Tilt) @ 1 ml/L or Tebuconazole 25% WG @ 1 g/L water.",
      culturalTips:
        "Scout northern field borders first. Spray immediately when the first yellow focus patch is observed.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Clear sunny morning",
    },
  ],
  Soybean: [
    {
      id: "soybean-rust",
      name: "Soybean Asian Rust",
      localName: "సోయాబీన్ రస్ట్ / सोयाबीन रतुआ",
      scientificName: "Phakopsora pachyrhizi",
      type: "Fungal Foliar Pathogen",
      confidence: 95.2,
      severity: 3,
      severityLabel: "Volcano Pustules",
      vector: "Airborne urediniospores",
      sampleImg:
        "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Small polygonal water-soaked lesions turning tan to reddish-brown",
        "Raised volcano-like pustules on lower leaf epidermis releasing tan spores",
        "Rapid yellowing and premature defoliation from lower canopy upwards",
      ],
      organicRemedy:
        "Spray Panchagavya @ 30 ml/L or fermented cow urine 10% solution. Foliar spray of Pseudomonas fluorescens @ 5 g/L.",
      chemicalRemedy:
        "Hexaconazole 5% EC @ 2 ml/L or Pyraclostrobin 20% WG @ 1 g/L water at first appearance.",
      culturalTips:
        "Maintain optimum plant spacing to avoid dense canopy humidity. Sow tolerant varieties like JS-335 or NRC-37.",
      waterVolume: "150-200 Litres / Acre",
      bestSprayTime: "Early Morning (7:00 AM – 9:30 AM)",
    },
  ],
  Maize: [
    {
      id: "maize-fall-armyworm",
      name: "Fall Armyworm (FAW)",
      localName: "మొక్కజొన్న కత్తెర పురుగు / मक्का फॉल आर्मीवर्म",
      scientificName: "Spodoptera frugiperda",
      type: "Noctuid Pest Infestation",
      confidence: 96.8,
      severity: 4,
      severityLabel: "Whorl Windowpaning & Frass",
      vector: "Adult female moth egg masses in whorl",
      sampleImg:
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Elongated papery feeding 'windows' on unfolding leaves",
        "Large irregular ragged shot holes and shredded leaves in whorl",
        "Copious yellowish sawdust-like moist frass packed deep in the whorl",
      ],
      organicRemedy:
        "Whorl application of dry river sand + lime (9:1 ratio) or neem cake powder. Release egg parasitoids Trichogramma pretiosum @ 50,000/acre.",
      chemicalRemedy:
        "Chlorantraniliprole 18.5% SC @ 0.4 ml/L or Spinetoram 11.7% SC @ 0.5 ml/L directed straight into whorl.",
      culturalTips:
        "Set up 5 pheromone traps per acre. Practice intercropping with cowpea or desmodium to attract natural predators.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Late Afternoon (4:30 PM – 6:30 PM)",
    },
  ],
};
