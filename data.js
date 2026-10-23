// వాహన రకాలు, బ్రాండ్‌లు, జిల్లాలు, DEMO నమూనాలు

export const CATEGORIES = [
  { id: "bike",       icon: "🏍️", te: "బైక్",          en: "Bike" },
  { id: "scooter",    icon: "🛵", te: "స్కూటర్",        en: "Scooter" },
  { id: "car",        icon: "🚗", te: "కార్",           en: "Car" },
  { id: "auto",       icon: "🛺", te: "ఆటో",           en: "Auto" },
  { id: "tractor",    icon: "🚜", te: "ట్రాక్టర్",       en: "Tractor" },
  { id: "commercial", icon: "🚚", te: "వాణిజ్య వాహనం", en: "Commercial" },
  { id: "other",      icon: "🔧", te: "ఇతర",           en: "Other" }
];

export const FUELS = [
  { id: "petrol",   te: "పెట్రోల్",    en: "Petrol" },
  { id: "diesel",   te: "డీజిల్",      en: "Diesel" },
  { id: "cng",      te: "CNG",        en: "CNG" },
  { id: "electric", te: "ఎలక్ట్రిక్",  en: "Electric" },
  { id: "hybrid",   te: "హైబ్రిడ్",    en: "Hybrid" }
];

// బ్రాండ్ → మోడల్స్ (జాబితాలో లేకపోతే యూజర్ స్వయంగా టైప్ చేయవచ్చు)
export const BRANDS = {
  bike: {
    "Hero": ["Splendor Plus", "HF Deluxe", "Passion", "Glamour", "Super Splendor", "Xtreme 160R", "Vida V1 (EV)"],
    "Honda": ["Shine", "SP 125", "Unicorn", "Livo", "CB350", "Hornet 2.0"],
    "Bajaj": ["Platina", "CT 110", "Pulsar 150", "Pulsar NS200", "Avenger", "Dominar", "Freedom 125 CNG"],
    "TVS": ["Raider 125", "Apache RTR 160", "Star City+", "Sport", "Ronin"],
    "Royal Enfield": ["Classic 350", "Bullet 350", "Hunter 350", "Meteor 350", "Himalayan"],
    "Yamaha": ["FZ", "R15", "MT-15", "Saluto"],
    "Suzuki": ["Gixxer", "Intruder"],
    "KTM": ["Duke 200", "Duke 390", "RC 200"],
    "Revolt (EV)": ["RV400", "RV1"],
    "Ultraviolette (EV)": ["F77"]
  },
  scooter: {
    "Honda": ["Activa 6G", "Activa 125", "Dio", "Activa e (EV)"],
    "TVS": ["Jupiter", "Ntorq 125", "Scooty Pep+", "iQube (EV)"],
    "Suzuki": ["Access 125", "Burgman Street"],
    "Yamaha": ["Fascino", "RayZR"],
    "Hero": ["Pleasure+", "Destini 125", "Vida (EV)"],
    "Ather (EV)": ["450X", "450S", "Rizta"],
    "Ola Electric (EV)": ["S1 Pro", "S1 Air", "S1 X"],
    "Bajaj": ["Chetak (EV)"]
  },
  car: {
    "Maruti Suzuki": ["Alto", "Wagon R", "Swift", "Dzire", "Baleno", "Ertiga", "Brezza", "Celerio", "Eeco", "Fronx", "Grand Vitara"],
    "Hyundai": ["i10", "i20", "Grand i10 Nios", "Venue", "Creta", "Verna", "Aura", "Exter"],
    "Tata": ["Tiago", "Tigor", "Altroz", "Nexon", "Punch", "Harrier", "Safari", "Nexon EV", "Tiago EV", "Punch EV"],
    "Mahindra": ["Bolero", "Scorpio", "Scorpio-N", "XUV300", "XUV700", "Thar", "XUV400 EV", "BE 6 (EV)"],
    "Toyota": ["Innova", "Innova Crysta", "Fortuner", "Glanza", "Etios"],
    "Honda": ["City", "Amaze", "Jazz", "WR-V"],
    "Kia": ["Seltos", "Sonet", "Carens"],
    "Renault": ["Kwid", "Triber", "Kiger"],
    "MG": ["Hector", "Astor", "Comet EV", "Windsor EV", "ZS EV"],
    "BYD (EV)": ["Atto 3", "Seal"]
  },
  auto: {
    "Bajaj": ["RE Compact", "Maxima", "RE E-TEC (EV)"],
    "Piaggio": ["Ape City", "Ape Xtra", "Ape E-City (EV)"],
    "Mahindra": ["Alfa", "Treo (EV)"],
    "TVS": ["King"],
    "Atul": ["Gem", "Elite (EV)"],
    "E-Rickshaw (EV)": ["Local brand"]
  },
  tractor: {
    "Mahindra": ["275 DI", "475 DI", "575 DI", "Arjun 555", "Yuvo"],
    "Swaraj": ["735 FE", "744 FE", "855 FE"],
    "Sonalika": ["DI 745", "DI 750", "Tiger"],
    "John Deere": ["5050 D", "5310", "5105"],
    "Eicher": ["380", "485", "557"],
    "Massey Ferguson": ["241 DI", "1035 DI", "7250"],
    "New Holland": ["3600", "3630"],
    "Kubota": ["MU4501", "NeoStar"]
  },
  commercial: {
    "Tata": ["Ace", "Intra", "407", "Yodha", "Ace EV"],
    "Mahindra": ["Bolero Pickup", "Jeeto", "Supro"],
    "Ashok Leyland": ["Dost", "Bada Dost", "Ecomet"],
    "Eicher": ["Pro 2049", "Pro 3015"],
    "Maruti Suzuki": ["Super Carry"]
  },
  other: {}
};

// తెలంగాణ జిల్లాలు: [English, lat, lng, తెలుగు] (GPS లేకపోతే ఈ కేంద్రాలు వాడుతాం — అంచనా కోఆర్డినేట్‌లు)
export const DISTRICTS = [
  ["Adilabad", 19.664, 78.532, "ఆదిలాబాద్"], ["Bhadradri Kothagudem", 17.556, 80.619, "భద్రాద్రి కొత్తగూడెం"], ["Hanumakonda", 18.011, 79.558, "హనుమకొండ"],
  ["Hyderabad", 17.385, 78.487, "హైదరాబాద్"], ["Jagtial", 18.794, 78.917, "జగిత్యాల"], ["Jangaon", 17.725, 79.152, "జనగామ"],
  ["Jayashankar Bhupalpally", 18.431, 79.862, "జయశంకర్ భూపాలపల్లి"], ["Jogulamba Gadwal", 16.234, 77.799, "జోగులాంబ గద్వాల"], ["Kamareddy", 18.320, 78.338, "కామారెడ్డి"],
  ["Karimnagar", 18.439, 79.129, "కరీంనగర్"], ["Khammam", 17.247, 80.151, "ఖమ్మం"], ["Kumuram Bheem Asifabad", 19.365, 79.284, "కుమురం భీం ఆసిఫాబాద్"],
  ["Mahabubabad", 17.598, 80.002, "మహబూబాబాద్"], ["Mahabubnagar", 16.738, 77.998, "మహబూబ్‌నగర్"], ["Mancherial", 18.871, 79.444, "మంచిర్యాల"],
  ["Medak", 18.046, 78.263, "మెదక్"], ["Medchal-Malkajgiri", 17.630, 78.481, "మేడ్చల్-మల్కాజ్‌గిరి"], ["Mulugu", 18.191, 79.943, "ములుగు"],
  ["Nagarkurnool", 16.482, 78.312, "నాగర్‌కర్నూల్"], ["Nalgonda", 17.054, 79.267, "నల్గొండ"], ["Narayanpet", 16.745, 77.496, "నారాయణపేట"],
  ["Nirmal", 19.096, 78.344, "నిర్మల్"], ["Nizamabad", 18.672, 78.094, "నిజామాబాద్"], ["Peddapalli", 18.614, 79.374, "పెద్దపల్లి"],
  ["Rajanna Sircilla", 18.387, 78.810, "రాజన్న సిరిసిల్ల"], ["Rangareddy", 17.250, 78.300, "రంగారెడ్డి"], ["Sangareddy", 17.624, 78.087, "సంగారెడ్డి"],
  ["Siddipet", 18.102, 78.852, "సిద్దిపేట"], ["Suryapet", 17.140, 79.620, "సూర్యాపేట"], ["Vikarabad", 17.338, 77.905, "వికారాబాద్"],
  ["Wanaparthy", 16.362, 78.063, "వనపర్తి"], ["Warangal", 17.968, 79.594, "వరంగల్"], ["Yadadri Bhuvanagiri", 17.511, 78.889, "యాదాద్రి భువనగిరి"]
];

// DEMO మోడ్ నమూనా వాహనాలు (Firebase సెటప్ అయ్యాక వాడరు)
const day = 86400000, now = Date.now();
const img = (seed) => `https://picsum.photos/seed/${seed}/640/480`;
export const SAMPLE = [
  { id: "d1", category: "bike", brand: "Hero", model: "Splendor Plus", year: 2021, kmDriven: 18500, fuel: "petrol", owners: 1, price: 52000, negotiable: true, place: "Makthal", district: "Narayanpet", lat: 16.501, lng: 77.519, photos: [img("bike1")], ownerName: "Ramesh", ownerPhone: "+919999999999", description: "మంచి కండిషన్, సర్వీస్ రికార్డ్ ఉంది.", createdAt: now - 2 * day, featuredUntil: now + 5 * day, status: "approved", views: 34 },
  { id: "d2", category: "scooter", brand: "Ather (EV)", model: "450X", year: 2023, kmDriven: 9200, fuel: "electric", owners: 1, price: 98000, negotiable: true, place: "Narayanpet", district: "Narayanpet", lat: 16.745, lng: 77.496, photos: [img("ev2")], ownerName: "Sravani", ownerPhone: "+919999999999", description: "బ్యాటరీ వారంటీ ఉంది, హోమ్ ఛార్జర్ ఇస్తాను.", ev: { batteryHealth: 94, rangeKm: 105, batteryWarrantyMonths: 22, chargerIncluded: true, chargeTimeHrs: 5 }, createdAt: now - 1 * day, status: "approved", views: 51 },
  { id: "d3", category: "car", brand: "Maruti Suzuki", model: "Swift", year: 2019, kmDriven: 54000, fuel: "petrol", owners: 2, transmission: "manual", price: 465000, negotiable: true, place: "Mahabubnagar", district: "Mahabubnagar", lat: 16.738, lng: 77.998, photos: [img("car3")], ownerName: "Kiran", ownerPhone: "+919999999999", description: "ఇన్సూరెన్స్ ఉంది. కొత్త టైర్లు.", createdAt: now - 5 * day, status: "approved", views: 88 },
  { id: "d4", category: "tractor", brand: "Mahindra", model: "575 DI", year: 2018, kmDriven: 3200, fuel: "diesel", owners: 1, price: 520000, negotiable: true, place: "Utkoor", district: "Narayanpet", lat: 16.629, lng: 77.420, photos: [img("tractor4")], ownerName: "Venkat Reddy", ownerPhone: "+919999999999", description: "గంటలు: 3200. రోటవేటర్‌తో కలిపి కూడా ఇస్తాను.", createdAt: now - 3 * day, status: "approved", views: 40 },
  { id: "d5", category: "auto", brand: "Piaggio", model: "Ape E-City (EV)", year: 2022, kmDriven: 31000, fuel: "electric", owners: 1, price: 145000, negotiable: false, place: "Kosgi", district: "Narayanpet", lat: 16.987, lng: 77.716, photos: [img("auto5")], ownerName: "Shiva", ownerPhone: "+919999999999", description: "రోజూ నడుస్తోంది, పర్మిట్ ఉంది.", ev: { batteryHealth: 82, rangeKm: 80, batteryWarrantyMonths: 0, chargerIncluded: true, chargeTimeHrs: 4 }, createdAt: now - 7 * day, status: "approved", views: 19 },
  { id: "d6", category: "car", brand: "Tata", model: "Nexon EV", year: 2022, kmDriven: 38000, fuel: "electric", owners: 1, transmission: "automatic", price: 985000, negotiable: true, place: "Kukatpally", district: "Medchal-Malkajgiri", lat: 17.494, lng: 78.399, photos: [img("ev6")], ownerName: "Anil", ownerPhone: "+919999999999", description: "బ్యాటరీ వారంటీ 2030 వరకు.", ev: { batteryHealth: 91, rangeKm: 280, batteryWarrantyMonths: 44, chargerIncluded: true, chargeTimeHrs: 8 }, createdAt: now - 4 * day, status: "approved", views: 120 }
];

// ---------- తెలుగు వాయిస్ / సెర్చ్ నిఘంటువు ----------
// "cat:" = వాహన రకం, "ev" = ఎలక్ట్రిక్, మిగతావి వాహనాల్లో వెతికే ఇంగ్లీష్ పదాలు
export const VOICE_MAP = {
  // రకాలు
  "బైక్": "cat:bike", "బైకు": "cat:bike", "మోటార్": "cat:bike", "మోటర్": "cat:bike", "bike": "cat:bike", "bikes": "cat:bike", "motorcycle": "cat:bike",
  "స్కూటర్": "cat:scooter", "స్కూటీ": "cat:scooter", "స్కూటరు": "cat:scooter", "scooter": "cat:scooter", "scooty": "cat:scooter",
  "కార్": "cat:car", "కారు": "cat:car", "car": "cat:car", "cars": "cat:car",
  "ఆటో": "cat:auto", "auto": "cat:auto", "rickshaw": "cat:auto",
  "ట్రాక్టర్": "cat:tractor", "ట్రాక్టరు": "cat:tractor", "tractor": "cat:tractor",
  "లారీ": "cat:commercial", "ట్రక్": "cat:commercial", "ట్రక్కు": "cat:commercial", "వ్యాన్": "cat:commercial", "డీసీఎం": "cat:commercial", "truck": "cat:commercial", "lorry": "cat:commercial", "van": "cat:commercial",
  "ఎలక్ట్రిక్": "ev", "ఈవీ": "ev", "electric": "ev", "ev": "ev",
  // కంపెనీలు
  "హీరో": "hero", "హోండా": "honda", "బజాజ్": "bajaj", "టీవీఎస్": "tvs", "టివిఎస్": "tvs", "రాయల్": "royal", "ఎన్‌ఫీల్డ్": "enfield", "ఎన్ఫీల్డ్": "enfield",
  "బుల్లెట్": "bullet", "యమహా": "yamaha", "సుజుకి": "suzuki", "కేటీఎం": "ktm", "ఏథర్": "ather", "ఓలా": "ola", "రివోల్ట్": "revolt",
  "మారుతి": "maruti", "హ్యుందాయ్": "hyundai", "హుండాయ్": "hyundai", "టాటా": "tata", "మహీంద్రా": "mahindra", "మహేంద్ర": "mahindra", "టొయోటా": "toyota", "టయోటా": "toyota",
  "కియా": "kia", "రెనాల్ట్": "renault", "స్వరాజ్": "swaraj", "సోనాలికా": "sonalika", "జాన్": "john", "డీర్": "deere", "ఐషర్": "eicher", "మాస్సీ": "massey",
  "పియాజియో": "piaggio", "అశోక్": "ashok", "లేలాండ్": "leyland", "కుబోటా": "kubota",
  // మోడల్స్
  "స్ప్లెండర్": "splendor", "స్ప్లెండరు": "splendor", "ప్యాషన్": "passion", "గ్లామర్": "glamour", "షైన్": "shine", "యూనికార్న్": "unicorn", "ప్లాటినా": "platina",
  "పల్సర్": "pulsar", "అపాచీ": "apache", "క్లాసిక్": "classic", "హంటర్": "hunter", "యాక్టివా": "activa", "జూపిటర్": "jupiter", "యాక్సెస్": "access", "డెస్టిని": "destini",
  "చేతక్": "chetak", "స్విఫ్ట్": "swift", "డిజైర్": "dzire", "ఆల్టో": "alto", "వ్యాగనార్": "wagon", "బాలెనో": "baleno", "ఎర్టిగా": "ertiga", "బ్రెజా": "brezza",
  "క్రెటా": "creta", "వెన్యూ": "venue", "ఇన్నోవా": "innova", "ఫార్చ్యూనర్": "fortuner", "బొలెరో": "bolero", "స్కార్పియో": "scorpio", "థార్": "thar",
  "నెక్సాన్": "nexon", "పంచ్": "punch", "టియాగో": "tiago", "ఏస్": "ace", "క్విడ్": "kwid",
  // ఊర్లు (place పేరుతో వెతకడానికి)
  "మక్తల్": "makthal", "ఉట్కూర్": "utkoor", "కోస్గి": "kosgi", "మద్దూర్": "maddur", "దామరగిద్ద": "damaragidda", "మాగనూర్": "maganoor", "నర్వ": "narva",
  "కూకట్‌పల్లి": "kukatpally", "కూకట్పల్లి": "kukatpally", "జడ్చర్ల": "jadcherla", "షాద్‌నగర్": "shadnagar", "షాద్నగర్": "shadnagar"
};
// అర్థం లేని చిన్న పదాలు (వీటిని వదిలేస్తాం)
export const STOP_WORDS = new Set(["దగ్గర", "దగ్గరలో", "దగ్గరి", "కావాలి", "ఉన్న", "ఉన్నవి", "ఒక", "సెకండ్", "హ్యాండ్", "అమ్మకానికి", "చూపించు", "చూపించండి", "వెతుకు",
  "వెతకండి", "రూపాయల", "రూపాయలు", "ధర", "లో", "నాకు", "మంచి", "కి", "జిల్లా", "జిల్లాలో", "వాహనం", "వాహనాలు", "బండి",
  "near", "in", "a", "the", "for", "sale", "second", "hand", "show", "me", "i", "want", "rs", "rupees", "district", "used", "with"]);
