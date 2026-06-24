export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  categoryHindi: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  descriptionHindi: string;
  specs: { key: string; value: string }[];
  features: string[];
  reviews: { user: string; rating: number; comment: string; date: string }[];
}

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Redmi Note 13 Pro (128GB)",
    nameHindi: "रेडमी नोट 13 प्रो (128जीबी)",
    category: "Electronics",
    categoryHindi: "इलेक्ट्रॉनिक्स",
    price: 21999,
    originalPrice: 28999,
    rating: 4.3,
    reviewsCount: 1420,
    image: "https://picsum.photos/seed/redminote/500/400",
    description: "Experience the ultimate performance with 200MP Ultra-Clear Camera, 1.5K AMOLED display, and Snapdragon 7s Gen 2 processor.",
    descriptionHindi: "200MP अल्ट्रा-क्लियर कैमरा, 1.5K AMOLED डिस्प्ले और स्नैपड्रैगन 7s जेन 2 प्रोसेसर के साथ बेहतरीन परफॉर्मेंस का अनुभव करें।",
    specs: [
      { key: "Display", value: "6.67 inches 1.5K 120Hz AMOLED" },
      { key: "Camera", value: "200MP + 8MP + 2MP Rear | 16MP Front" },
      { key: "Processor", value: "Snapdragon 7s Gen 2" },
      { key: "Battery", value: "5100mAh with 67W Fast Turbo Charge" }
    ],
    features: [
      "200MP Camera with OIS for shake-free photos",
      "Corning Gorilla Glass Victus protection",
      "Dual Stereo Speakers with Dolby Atmos",
      "In-display fingerprint sensor"
    ],
    reviews: [
      { user: "Amit Sharma", rating: 5, comment: "Best phone in this price range! Camera quality is amazing.", date: "2026-05-12" },
      { user: "Priya Patel", rating: 4, comment: "Battery life is good but charging could be a bit faster.", date: "2026-06-01" },
      { user: "Rohan Verma", rating: 4, comment: "Bahut accha display hai, viewing angles are superb.", date: "2026-06-18" }
    ]
  },
  {
    id: "prod-2",
    name: "Boat Airdopes 141 Wireless Earbuds",
    nameHindi: "बोट एयरडोपेस 141 वायरलेस इयरबड्स",
    category: "Electronics",
    categoryHindi: "इलेक्ट्रॉनिक्स",
    price: 1299,
    originalPrice: 4490,
    rating: 4.1,
    reviewsCount: 8940,
    image: "https://picsum.photos/seed/boatearbuds/500/400",
    description: "True Wireless Earbuds with 42 Hours Playback, Beast Mode for gaming, and ENx Technology for crystal-clear calls.",
    descriptionHindi: "क्रिस्टल-क्लियर कॉल्स के लिए 42 घंटे प्लेबैक, गेमिंग के लिए बीस्ट मोड और ENx तकनीक के साथ ट्रू वायरलेस इयरबड्स।",
    specs: [
      { key: "Battery", value: "Up to 42 Hours total playtime" },
      { key: "Drivers", value: "8mm Dynamic Drivers" },
      { key: "Bluetooth", value: "v5.1 with Instant Connect" },
      { key: "IP Rating", value: "IPX4 Sweat & Water Resistant" }
    ],
    features: [
      "ASAP Charge: 5 mins charge gives 75 mins playtime",
      "Beast Mode with low latency (80ms) for mobile gaming",
      "One Touch Voice Assistant activation",
      "Type-C charging port"
    ],
    reviews: [
      { user: "Suresh Kumar", rating: 5, comment: "Superb bass, noise cancellation works well for calls.", date: "2026-04-20" },
      { user: "Nisha Singh", rating: 3, comment: "Left earbud stopped pairing after 2 months, got it replaced under warranty.", date: "2026-05-30" }
    ]
  },
  {
    id: "prod-3",
    name: "Noise ColorFit Pulse 3 Smart Watch",
    nameHindi: "नॉइज़ कलरफिट पल्स 3 स्मार्ट वॉच",
    category: "Electronics",
    categoryHindi: "इलेक्ट्रॉनिक्स",
    price: 1499,
    originalPrice: 4999,
    rating: 4.0,
    reviewsCount: 3120,
    image: "https://picsum.photos/seed/noisewatch/500/400",
    description: "Smartwatch with 1.96'' TFT Display, Bluetooth Calling, Heart Rate & SpO2 Tracking, and 100+ Sports Modes.",
    descriptionHindi: "1.96 इंच टीएफटी डिस्प्ले, ब्लूटूथ कॉलिंग, हार्ट रेट और SpO2 ट्रैकिंग और 100+ स्पोर्ट्स मोड के साथ स्मार्टवॉच।",
    specs: [
      { key: "Display", value: "1.96 inch HD Display" },
      { key: "Calling", value: "Advanced Bluetooth Calling" },
      { key: "Sensors", value: "SpO2, 24/7 Heart Rate, Sleep Tracker" },
      { key: "Battery", value: "Up to 7 days battery backup" }
    ],
    features: [
      "Access logs, dial pad, and save contacts on the wrist",
      "IP68 dust and water protection",
      "Smart notifications for calls, messages, and social media",
      "Customizable Cloud-based watch faces"
    ],
    reviews: [
      { user: "Vijay Yadav", rating: 4, comment: "Bluetooth calling is very clear. Display looks premium.", date: "2026-06-05" },
      { user: "Aakash Gupta", rating: 4, comment: "Paisa vasool smartwatch! Sasta aur accha.", date: "2026-06-15" }
    ]
  },
  {
    id: "prod-4",
    name: "Adidas Men's Strider Running Shoes",
    nameHindi: "एडिडास मेन्स स्ट्राइडर रनिंग शूज",
    category: "Fashion",
    categoryHindi: "फैशन और कपड़े",
    price: 2499,
    originalPrice: 4999,
    rating: 4.4,
    reviewsCount: 750,
    image: "https://picsum.photos/seed/adidasshoes/500/400",
    description: "Highly breathable running shoes with cloudfoam midsole comfort and durable rubber grip for your morning jogs.",
    descriptionHindi: "आपके सुबह के जॉग्स के लिए क्लाउडफ़ोम मिडसोल कम्फर्ट और टिकाऊ रबर ग्रिप वाले सांस लेने योग्य रनिंग शूज़।",
    specs: [
      { key: "Material", value: "Premium Mesh Upper" },
      { key: "Sole", value: "Durable Traction Rubber" },
      { key: "Weight", value: "Lightweight (~280g)" },
      { key: "Cushion", value: "Cloudfoam Midsole" }
    ],
    features: [
      "Breathable engineered mesh upper keeps feet dry",
      "Eco-friendly materials (at least 50% recycled content)",
      "Reinforced heel counter for stable support",
      "Stylish iconic 3-stripes brand logo"
    ],
    reviews: [
      { user: "Sandeep Mishra", rating: 5, comment: "Extremely comfortable for running. Fit is perfect.", date: "2026-05-15" },
      { user: "Sneha Rawat", rating: 4, comment: "Very good quality, bought it for my brother. He loves it.", date: "2026-06-10" }
    ]
  },
  {
    id: "prod-5",
    name: "Lavie Women's Handbag (Tan)",
    nameHindi: "लावी विमेन्स हैंडबैग (टैन)",
    category: "Fashion",
    categoryHindi: "फैशन और कपड़े",
    price: 1899,
    originalPrice: 3999,
    rating: 4.2,
    reviewsCount: 540,
    image: "https://picsum.photos/seed/laviehandbag/500/400",
    description: "Elegant tan colored shoulder tote bag with multiple zip pockets, durable leather build, and classy hardware accent.",
    descriptionHindi: "एलिगेंट टैन रंग का शोल्डर टोट बैग जिसमें कई ज़िप पॉकेट, टिकाऊ लेदर फैब्रिक और क्लासी हार्डवेयर एक्सेंट हैं।",
    specs: [
      { key: "Material", value: "Premium Faux Leather" },
      { key: "Pockets", value: "2 Main Compartments, 4 Inner Pockets" },
      { key: "Type", value: "Shoulder Tote / Handbag" },
      { key: "Dimensions", value: "34 x 13 x 27 cm" }
    ],
    features: [
      "Dual top handles with detachable long shoulder strap",
      "Sturdy base studs to protect leather from scratches",
      "High-quality zipper closures",
      "Perfect for college, work, or casual outings"
    ],
    reviews: [
      { user: "Ridhi Jain", rating: 5, comment: "Looks so premium! Spacing inside is great.", date: "2026-03-22" },
      { user: "Anjali Sharma", rating: 4, comment: "Nice design and stitches. Colour is exactly as shown.", date: "2026-05-18" }
    ]
  },
  {
    id: "prod-6",
    name: "Pigeon Non-Stick Cookware Set (3-Piece)",
    nameHindi: "पिजन नॉन-स्टिक कुकवेयर सेट (3-पीस)",
    category: "Home & Kitchen",
    categoryHindi: "होम और किचन",
    price: 1699,
    originalPrice: 3495,
    rating: 4.2,
    reviewsCount: 1850,
    image: "https://picsum.photos/seed/pigeoncure/500/400",
    description: "Premium induction friendly 3-piece cookware set containing Flat Tawa, Kadai with Glass Lid, and Fry Pan.",
    descriptionHindi: "प्रीमियम इंडक्शन फ्रेंडली 3-पीस कुकवेयर सेट जिसमें फ्लैट तवा, ग्लास लिड के साथ कड़ाही और फ्राई पैन शामिल हैं।",
    specs: [
      { key: "Material", value: "High Grade Aluminum" },
      { key: "Coating", value: "5-Layer Non-Stick German Technology" },
      { key: "Induction Compatible", value: "Yes (Works on Gas & Induction)" },
      { key: "Warranty", value: "1 Year pigeon warranty" }
    ],
    features: [
      "PFOA Free non-toxic coating for healthy cooking",
      "Ergonomic cool-touch bakelite handles",
      "Thick aluminum body for uniform heat distribution",
      "Glass lid with steam vent hole"
    ],
    reviews: [
      { user: "Sarla Devi", rating: 5, comment: "Bohot badhiya set hai. Bilkul chipakta nahi hai khana.", date: "2026-04-12" },
      { user: "Ritu Goel", rating: 4, comment: "Kadai size is perfect. Tawa could have been slightly wider.", date: "2026-05-24" }
    ]
  },
  {
    id: "prod-7",
    name: "Prestige Iris 750W Mixer Grinder",
    nameHindi: "प्रेस्टिज आइरिस 750W मिक्सर ग्राइंडर",
    category: "Home & Kitchen",
    categoryHindi: "होम और किचन",
    price: 3299,
    originalPrice: 5295,
    rating: 4.1,
    reviewsCount: 2900,
    image: "https://picsum.photos/seed/prestigemixer/500/400",
    description: "750 Watt powerful mixer grinder with 3 stainless steel jars and 1 transparent juicer jar for all your grinding needs.",
    descriptionHindi: "आपकी सभी ग्राइंडिंग जरूरतों के लिए 3 स्टेनलेस स्टील जार और 1 पारदर्शी जूसर जार के साथ 750 वॉट का शक्तिशाली मिक्सर ग्राइंडर।",
    specs: [
      { key: "Power", value: "750 Watts Heavy Duty Motor" },
      { key: "Jars", value: "3 SS Jars + 1 Polycarbonate Juicer Jar" },
      { key: "Speed Control", value: "3 Speed control with Pulse" },
      { key: "Safety", value: "Overload Protector Switch" }
    ],
    features: [
      "Sturdy rust-proof stainless steel blades for fine grinding",
      "Ergonomically designed jar handles for easy grip",
      "Non-slip suction feet for high stability during operation",
      "Vibrant blue color accent body"
    ],
    reviews: [
      { user: "Gaurav Sen", rating: 4, comment: "Powerful motor. Chutney jar is excellent.", date: "2026-05-09" },
      { user: "Karan Johar", rating: 4, comment: "Noise level is normal for a 750W motor. Grind is perfect.", date: "2026-06-12" }
    ]
  },
  {
    id: "prod-8",
    name: "Rich Dad Poor Dad (Hindi Paperback)",
    nameHindi: "रिच डैड पुअर डैड (हिंदी पेपरबैक)",
    category: "Books",
    categoryHindi: "किताबें",
    price: 249,
    originalPrice: 399,
    rating: 4.6,
    reviewsCount: 4120,
    image: "https://picsum.photos/seed/richdadbook/500/400",
    description: "Robert T. Kiyosaki's financial classic translated in Hindi. Learn how to grow your money and build wealth.",
    descriptionHindi: "रॉबर्ट टी. कियोसाकी की फाइनेंशियल क्लासिक किताब का हिंदी अनुवाद। जानें कि अपने पैसे को कैसे बढ़ाएं और संपत्ति कैसे बनाएं।",
    specs: [
      { key: "Author", value: "Robert T. Kiyosaki" },
      { key: "Format", value: "Paperback" },
      { key: "Language", value: "Hindi" },
      { key: "Pages", value: "248 Pages" }
    ],
    features: [
      "Explodes the myth that you need to earn a high income to become rich",
      "Teaches what parents should teach their kids about money management",
      "Simple, easy-to-understand Hindi translation",
      "Perfect for beginner investors and book lovers"
    ],
    reviews: [
      { user: "Devendra Patel", rating: 5, comment: "Har insaan ko ye book padhni chahiye! Life changing ideas.", date: "2026-01-10" },
      { user: "Suresh S.", rating: 5, comment: "Amazing principles. Very useful book on finance.", date: "2026-04-14" }
    ]
  },
  {
    id: "prod-9",
    name: "UPSC Civil Services Prelims Exam Guide",
    nameHindi: "UPSC सिविल सर्विसेज प्रीलिम्स एग्जाम गाइड",
    category: "Books",
    categoryHindi: "किताबें",
    price: 799,
    originalPrice: 1250,
    rating: 4.5,
    reviewsCount: 890,
    image: "https://picsum.photos/seed/upscbook/500/400",
    description: "Complete syllabus coverage for GS Paper I and CSAT with previous years' solved question papers.",
    descriptionHindi: "पिछले वर्षों के सॉल्व्ड क्वेश्चन पेपर्स के साथ जीएस पेपर I और सीसैट (CSAT) के लिए संपूर्ण सिलेबस कवरेज।",
    specs: [
      { key: "Subject", value: "UPSC General Studies & CSAT" },
      { key: "Edition", value: "2026 Updated Edition" },
      { key: "Publisher", value: "Bazaar Education" },
      { key: "Language", value: "Bilingual (English/Hindi inputs)" }
    ],
    features: [
      "Detailed analysis of UPSC CSE exam patterns",
      "Includes 10 Full-Length Mock Test Papers with explanation",
      "Special section on Indian Polity, History & Current Affairs",
      "QR code inside to scan for dynamic daily current affairs pdfs"
    ],
    reviews: [
      { user: "Deepak Rawat", rating: 5, comment: "Excellent guide. Mock test answers are detailed and clear.", date: "2026-05-20" },
      { user: "Mamta Sharma", rating: 4, comment: "Very heavy book, covers almost everything needed for GS-1.", date: "2026-06-11" }
    ]
  },
  {
    id: "prod-10",
    name: "Happilo Premium California Almonds (500g)",
    nameHindi: "हैपिलो प्रीमियम कैलिफोर्निया बादाम (500 ग्राम)",
    category: "Grocery",
    categoryHindi: "राशन और ग्रोसरी",
    price: 449,
    originalPrice: 650,
    rating: 4.5,
    reviewsCount: 3100,
    image: "https://picsum.photos/seed/almonds/500/400",
    description: "Premium handpicked California raw almonds. Rich in protein, healthy fats, and antioxidants. Packed in re-sealable bag.",
    descriptionHindi: "प्रीमियम चुने हुए कैलिफोर्निया कच्चे बादाम। प्रोटीन, स्वस्थ वसा और एंटीऑक्सीडेंट से भरपूर। री-सीलेबल बैग में पैक।",
    specs: [
      { key: "Quantity", value: "500g" },
      { key: "Container", value: "Ziplock Stand-up Pouch" },
      { key: "Gluten Free", value: "Yes" },
      { key: "Shelf Life", value: "12 Months" }
    ],
    features: [
      "100% natural, raw, and cholesterol free",
      "Great source of Vitamin E, Magnesium, and Fiber",
      "Excellent crunch and delicious taste",
      "Hygienically packed meeting international food safety standards"
    ],
    reviews: [
      { user: "Pankaj Vyas", rating: 5, comment: "Very fresh and crispy. Almond size is uniform.", date: "2026-06-14" },
      { user: "Leela Devi", rating: 5, comment: "Bacho ke liye bohot badhiya baadand. Clean packing.", date: "2026-06-20" }
    ]
  },
  {
    id: "prod-11",
    name: "Organic Tattva Organic Honey (500g)",
    nameHindi: "ऑर्गेनिक तत्व आर्गेनिक शहद (500 ग्राम)",
    category: "Grocery",
    categoryHindi: "राशन और ग्रोसरी",
    price: 299,
    originalPrice: 399,
    rating: 4.3,
    reviewsCount: 1230,
    image: "https://picsum.photos/seed/organic_honey/500/400",
    description: "100% pure organic wild honey extracted directly from remote forest hives, free from added sugars or artificial flavors.",
    descriptionHindi: "दूरदराज के जंगली छत्तों से सीधे निकाला गया 100% शुद्ध आर्गेनिक शहद, बिना किसी कृत्रिम मिठास या चीनी के।",
    specs: [
      { key: "Quantity", value: "500g" },
      { key: "Certification", value: "USDA Organic & India Organic certified" },
      { key: "Bottle", value: "Classy Food-safe Glass Bottle" },
      { key: "Purity", value: "Zero added sugar / No C3/C4 syrup" }
    ],
    features: [
      "Naturally sourced wild forest multi-floral nectar",
      "Boosts immunity and works as an excellent natural sweetener",
      "Tested for antibiotics and heavy metals",
      "Rich texture with high medicinal properties"
    ],
    reviews: [
      { user: "Surbhi Goel", rating: 5, comment: "Taste is distinct and organic, not oversweet like other brands.", date: "2026-04-29" },
      { user: "Rajesh Soni", rating: 4, comment: "Really nice glass bottle. Honey does not freeze easily.", date: "2026-05-11" }
    ]
  }
];
