// ============================================================
//  Vahan — సెట్టింగ్‌లు (SETUP.md లో చెప్పినట్టు ఇవి మార్చండి)
// ============================================================

// 1) Firebase Console → Project settings → Your apps → Web app config
export const firebaseConfig = {
  apiKey: "AIzaSyAIA7fm8jWyrRzURTa1pJf4oRTyI-K5noE",
  authDomain: "vahan-3e329.firebaseapp.com",
  projectId: "vahan-3e329",
  storageBucket: "vahan-3e329.firebasestorage.app",
  messagingSenderId: "1053616194015",
  appId: "1:1053616194015:web:5ede78c2d50d007a0fc46a"
};

// 2) Cloudinary → Settings → Upload → Upload preset (Unsigned)
export const cloudinary = {
  cloudName: "sxxbuqic",
  uploadPreset: "bawgoype"
};

// 3) మీ వివరాలు
export const site = {
  name: "Vahan",
  adminWhatsApp: "919959731120",   // బూస్ట్ / డీలర్ ప్లాన్ / సహాయం కోసం
  listingDays: 60,                 // ఎన్ని రోజుల తర్వాత లిస్టింగ్ ఎక్స్‌పైర్ అవుతుంది
  maxActivePerUser: 5,             // ఒక్కో యూజర్‌కు ఒకేసారి ఎన్ని లిస్టింగ్‌లు
  maxPhotos: 8,
  phoneOtp: false,                 // Firebase బిల్లింగ్ (Blaze) వచ్చాక true చేస్తే ఫోన్ OTP లాగిన్ కూడా వస్తుంది
  // వాహనం పోస్ట్ చేయడానికి ఫీజు (UPI). enabled: false చేస్తే ఉచితం అవుతుంది
  payment: {
    enabled: true,
    upiId: "Q203723761@ybl",
    payeeName: "Vahan",
    fees: { bike: 49, scooter: 49, auto: 79, car: 99, tractor: 99, commercial: 99, other: 49 },
    launchOffer: false,            // true చేస్తే అన్ని వాహనాలకూ launchPrice మాత్రమే (ఆఫర్)
    launchPrice: 19
  },
  boostPrices: { bike: 99, scooter: 99, car: 299, auto: 199, tractor: 299, commercial: 299, other: 99 }
};

// Firebase ఇంకా సెటప్ చేయకపోతే DEMO మోడ్‌లో నమూనా వాహనాలు చూపిస్తుంది
export const DEMO = firebaseConfig.apiKey.startsWith("YOUR_");
