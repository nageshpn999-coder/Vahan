// ============================================================
//  Vahan — సెట్టింగ్‌లు (SETUP.md లో చెప్పినట్టు ఇవి మార్చండి)
// ============================================================

// 1) Firebase Console → Project settings → Your apps → Web app config
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2) Cloudinary → Settings → Upload → Upload preset (Unsigned)
export const cloudinary = {
  cloudName: "YOUR_CLOUD_NAME",
  uploadPreset: "YOUR_UNSIGNED_PRESET"
};

// 3) మీ వివరాలు
export const site = {
  name: "Vahan",
  adminWhatsApp: "919959731120",   // బూస్ట్ / డీలర్ ప్లాన్ / సహాయం కోసం
  listingDays: 60,                 // ఎన్ని రోజుల తర్వాత లిస్టింగ్ ఎక్స్‌పైర్ అవుతుంది
  maxActivePerUser: 5,             // ఒక్కో యూజర్‌కు ఒకేసారి ఎన్ని లిస్టింగ్‌లు
  maxPhotos: 8,
  boostPrices: { bike: 99, scooter: 99, car: 299, auto: 199, tractor: 299, commercial: 299, other: 99 }
};

// Firebase ఇంకా సెటప్ చేయకపోతే DEMO మోడ్‌లో నమూనా వాహనాలు చూపిస్తుంది
export const DEMO = firebaseConfig.apiKey.startsWith("YOUR_");
