# Vahan — సెటప్ గైడ్ (తెలుగులో)

ఈ ఫైళ్లు అప్‌లోడ్ చేసిన వెంటనే సైట్ **DEMO మోడ్**‌లో నమూనా వాహనాలతో పనిచేస్తుంది. క్రింది 6 దశలు పూర్తి చేస్తే నిజమైన సైట్ లైవ్ అవుతుంది.

---

## దశ 1: GitHub లో అప్‌లోడ్ (5 నిమిషాలు)
1. GitHub లో కొత్త repository తయారు చేయండి, పేరు: `vahan`
2. ఈ zip లోని అన్ని ఫైళ్లు, ఫోల్డర్లు (`css/`, `js/`, `index.html` మొదలైనవి) అప్‌లోడ్ చేయండి
3. Settings → Pages → Branch: `main` → Save
4. కొన్ని నిమిషాల్లో `https://nageshpn999-coder.github.io/vahan/` లో DEMO సైట్ కనిపిస్తుంది

## దశ 2: కొత్త Firebase ప్రాజెక్ట్ (10 నిమిషాలు)
1. https://console.firebase.google.com → **Add project** → పేరు: `vahan`
2. **Build → Firestore Database → Create database** → లొకేషన్: `asia-south1 (Mumbai)` → Production mode
3. **Build → Authentication → Get started → Sign-in method → Phone** → Enable
4. Authentication → **Settings → Authorized domains** → మీ డొమైన్ జోడించండి (ఉదా: `nageshpn999-coder.github.io`, తర్వాత `vahan.in` వంటిది)
5. **Project settings (⚙️) → Your apps → Web (</>)** → యాప్ రిజిస్టర్ చేయండి → వచ్చిన `firebaseConfig` విలువలను `js/config.js` లో పేస్ట్ చేయండి

> ⚠️ Phone OTP కోసం Firebase **Blaze (pay-as-you-go)** ప్లాన్‌కు మారమని అడగవచ్చు. ఉచిత పరిమితి దాటితేనే ఒక్కో SMS కు చిన్న ఖర్చు వస్తుంది. Google Cloud లో **Budget alert (ఉదా: ₹500)** తప్పక పెట్టుకోండి.

## దశ 3: సెక్యూరిటీ రూల్స్ & ఇండెక్స్‌లు
1. Firestore → **Rules** ట్యాబ్ → `firestore.rules` ఫైల్‌లోని మొత్తం కోడ్ పేస్ట్ చేసి → **Publish**
2. Firestore → **Indexes → Composite → Create index** → ఈ రెండు తయారు చేయండి:
   - Collection: `vehicles` · Fields: `status` Ascending, `geohash` Ascending
   - Collection: `vehicles` · Fields: `status` Ascending, `createdAt` Descending

   (ఇండెక్స్ లేకపోతే సైట్ బ్రౌజర్ console లో ఒక లింక్ చూపిస్తుంది — దాన్ని క్లిక్ చేసినా ఆటోమేటిక్‌గా తయారవుతుంది.)

## దశ 4: ఫోటోల కోసం Cloudinary (ఉచితం)
1. https://cloudinary.com లో ఉచిత అకౌంట్ తయారు చేయండి
2. Dashboard లో **Cloud name** కాపీ చేయండి
3. **Settings → Upload → Upload presets → Add upload preset** → Signing mode: **Unsigned** → Folder: `vahan` → Save
4. `js/config.js` లో `cloudName`, `uploadPreset` పెట్టండి

## దశ 5: మిమ్మల్ని అడ్మిన్‌గా చేసుకోవడం
1. సైట్‌లో **అమ్మండి** → మీ నంబర్‌తో OTP లాగిన్ అవ్వండి
2. `admin.html` ఓపెన్ చేయండి — అక్కడ మీ **UID** కనిపిస్తుంది, కాపీ చేయండి
3. Firestore → **Start collection** → Collection ID: `admins` → Document ID: (మీ UID) → ఒక field: `name` = `Nagesh` → Save
4. `admin.html` రీఫ్రెష్ చేయండి — అడ్మిన్ ప్యానెల్ ఓపెన్ అవుతుంది ✓

## దశ 6: డొమైన్ (ఐచ్ఛికం)
GoDaddy లో డొమైన్ కొని, WorkPin లాగే A records (185.199.108–111.153) + GitHub Pages లో Custom domain పెట్టండి. తర్వాత Firebase Authorized domains లో కూడా ఆ డొమైన్ జోడించండి.

---

## రోజువారీ పని (అడ్మిన్)
- **చెక్ చేయాల్సినవి**: కొత్త వాహనాలు → ఫోటోలు, ధర సరిగ్గా ఉంటే ✓ అప్రూవ్
- **బూస్ట్ ఆదాయం**: యూజర్ "బూస్ట్" నొక్కితే మీకు WhatsApp వస్తుంది → UPI పేమెంట్ తీసుకుని → అడ్మిన్‌లో ★ **7 రోజులు ఫీచర్** నొక్కండి
- **డీలర్ ప్లాన్**: పేమెంట్ తర్వాత ఆ డీలర్ వాహనాలకు **+ Dealer** నొక్కండి (వారికి లిస్టింగ్ పరిమితి ఉండదు, బ్యాడ్జ్ వస్తుంది)
- **రిపోర్ట్‌లు**: మోసం అనిపిస్తే "వాహనం తీసేయండి"

## సెట్టింగ్‌లు మార్చడం (`js/config.js`)
- `adminWhatsApp` — బూస్ట్/డీలర్ మెసేజ్‌లు వచ్చే నంబర్
- `boostPrices` — ప్రతి రకానికి బూస్ట్ ధర
- `listingDays` (60), `maxActivePerUser` (5), `maxPhotos` (8)
- సైట్ పేరు మార్చాలంటే `site.name` మరియు HTML ఫైళ్లలోని `<title>`

## ఫైళ్ల వివరాలు
| ఫైల్ | పని |
|---|---|
| `index.html` + `js/home.js` | హోమ్ — దగ్గరలోని వాహనాల సెర్చ్, ఫిల్టర్లు, EV ఫిల్టర్ |
| `vehicle.html` + `js/vehicle.js` | వాహనం వివరాలు, ఫోటో గ్యాలరీ, EV బ్యాటరీ, WhatsApp/కాల్ |
| `sell.html` + `js/sell.js` | OTP లాగిన్ + 3 దశల అప్‌లోడ్ (ఎడిట్ కూడా) |
| `my.html` + `js/my.js` | నా వాహనాలు — ఎడిట్, అమ్ముడైంది, రెన్యూ, బూస్ట్ |
| `admin.html` + `js/admin.js` | అడ్మిన్ ప్యానెల్ |
| `js/data.js` | బ్రాండ్‌లు/మోడల్స్, జిల్లాలు — కొత్తవి ఇక్కడ జోడించండి |
| `js/common.js` | భాష (తెలుగు/English), కామన్ కోడ్ |
| `firestore.rules` | డేటా సెక్యూరిటీ |
