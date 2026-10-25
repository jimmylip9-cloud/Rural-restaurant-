import { NewProduct } from "./schema";

export interface SeedProductWithReviews extends Omit<NewProduct, "id" | "createdAt"> {
  reviews: {
    customerName: string;
    customerTag: string;
    rating: number;
    comment: string;
    spiceFeedback: string;
    helpfulCount: number;
  }[];
}

export const FEATURED_COLLECTIONS = [
  {
    id: "বিকেলের ফুচকা ও চটপটি",
    title: "বিকেলের ফুচকা ও চটপটি",
    subtitle: "টক-ঝাল তেঁতুল পানি ও মচমচে ফুচকা",
    description:
      "শেষ বিকেলের বাতাসে মচমচে ফুচকা, মিষ্টি দই ফুচকা আর গরম গরম ডিম-কুচি দেওয়া চটপটি ছাড়া আড্ডা একদমই জমে না।",
    badge: "সবচেয়ে জনপ্রিয়",
    accentColor: "#D9381E",
    image: "/images/fuchka-plate.jpg",
    itemCount: "৩টি স্পেশাল আইটেম",
  },
  {
    id: "ধোঁয়া ওঠা চা ও কফির চুমুক",
    title: "ধোঁয়া ওঠা চা ও কফির চুমুক",
    subtitle: "নরমাল চা, মালাই চা ও প্রিমিয়াম কফি",
    description:
      "মাটির কাপে ঘন সর দেওয়া মালাই চা, আদা-এলাচের নরমাল চা কিংবা ফেনা তোলা গরম ক্যাপুচিনো কফি—ক্লান্তি দূর করার সেরা সঙ্গী।",
    badge: "আড্ডার প্রাণ",
    accentColor: "#F59E0B",
    image: "/images/malai-tea.jpg",
    itemCount: "৩টি গরম পানীয়",
  },
  {
    id: "মচমচে ফ্রাই ও ক্যাফে স্ন্যাকস",
    title: "মচমচে ফ্রাই ও ক্যাফে স্ন্যাকস",
    subtitle: "চিকেন ফ্রাই, বার্গার ও ফ্রেঞ্চ ফ্রাইজ",
    description:
      "বাইরে গোল্ডেন ক্রিস্পি আর ভেতরে জুসি চিকেন ফ্রাই, গলানো চিজ বার্গার এবং পেরি-পেরি ফ্রেঞ্চ ফ্রাইজ—ছোট-বড় সবার প্রিয়।",
    badge: "হট অ্যান্ড ক্রিস্পি",
    accentColor: "#DC2626",
    image: "/images/chicken-fry.jpg",
    itemCount: "৪টি ক্যাফে স্ন্যাকস",
  },
  {
    id: "বন্ধুদের আড্ডা কম্বো",
    title: "বন্ধুদের আড্ডা কম্বো",
    subtitle: "মোমো, চাউমিন ও শেয়ারিং প্লাটার",
    description:
      "বন্ধুদের দল কিংবা পরিবারের সবার সাথে ভাগ করে খাওয়ার জন্য স্পেশাল চিকেন মোমো, চাউমিন ও আড্ডা কম্বো প্লাটার।",
    badge: "গ্রুপ স্পেশাল",
    accentColor: "#15803D",
    image: "/images/adda-platter-box.jpg",
    itemCount: "২টি কম্বো ও নুডলস",
  },
];

export const SEED_PRODUCTS: SeedProductWithReviews[] = [
  {
    name: "ফুচকা (১ প্লেট)",
    slug: "fuchka-1-plate",
    description:
      "মচমচে গোল্ডেন ফুচকার ভেতরে আলু-ডাবলি মাখা, ভাজা জিরা, ধনেপাতা, কাঁচামরিচ এবং ওপরে গ্রেট করা সিদ্ধ ডিম। সাথে থাকছে আমাদের ক্যাফের স্পেশাল টক-ঝাল-মিষ্টি তেঁতুলের পানি।",
    price: 70,
    originalPrice: 85,
    category: "ফুচকা ও চটপটি",
    collection: "বিকেলের ফুচকা ও চটপটি",
    spiceLevel: 2,
    dietaryTags: ["হালাল", "বেস্টসেলার", "ভেজিটেরিয়ান অপশন"],
    images: [
      "/images/fuchka-plate.jpg",
      "/images/doi-fuchka.jpg",
      "/images/chotpoti-bowl.jpg",
      "/images/hero-platter.jpg",
    ],
    badge: "১ প্লেট - ৭০ টাকা",
    prepTimeMinutes: 7,
    calories: 320,
    servingSize: "১ প্লেট (৮ পিস)",
    availableAddons: [
      { id: "extra-egg", name: "অতিরিক্ত সিদ্ধ ডিম কুচি", price: 20 },
      { id: "extra-tok", name: "অতিরিক্ত ১ কাপ তেঁতুল টক", price: 10 },
      { id: "naga-chili", name: "নাগা মরিচের ঝাল পেস্ট", price: 15 },
    ],
    inStock: true,
    ratingAvg: "4.98",
    reviewCount: 4,
    reviews: [
      {
        customerName: "নুসরাত জাহান",
        customerTag: "ফুচকা প্রেমী",
        rating: 5,
        comment:
          "মাত্র ৭০ টাকায় এত মচমচে আর সুস্বাদু ফুচকা পুরো এলাকায় আর কোথাও পাওয়া যায় না! তেঁতুলের টকটা জাস্ট অসাধারণ।",
        spiceFeedback: "একদম পারফেক্ট ঝাল",
        helpfulCount: 28,
      },
      {
        customerName: "রাকিবুল হাসান",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "ডেলিভারিতেও ফুচকা একদম মচমচে থাকে কারণ আলু মাখা আর তেঁতুলের টক আলাদা বক্সে সুন্দর করে প্যাক করে দেয়।",
        spiceFeedback: "টক-ঝাল স্বাদ",
        helpfulCount: 19,
      },
      {
        customerName: "তানজিলা আক্তার",
        customerTag: "কলেজ শিক্ষার্থী",
        rating: 5,
        comment:
          "বিকেলে বান্ধবীদের সাথে আড্ডা মানেই শেষ বিকেলের আড্ডার ২ প্লেট ফুচকা আর মালাই চা!",
        spiceFeedback: "সেরা স্বাদ",
        helpfulCount: 14,
      },
      {
        customerName: "সাদমান সাকিব",
        customerTag: "ফুডি",
        rating: 5,
        comment:
          "ওপরে ডিম কুচি আর ধনেপাতার পরিমাণটা বেশ ভালো দেয়। নাগা মরিচ অ্যাড করলে ঝালপ্রেমীদের মন ভরে যাবে।",
        spiceFeedback: "ঝাল ও মজাদার",
        helpfulCount: 11,
      },
    ],
  },
  {
    name: "চিকেন ফ্রাই",
    slug: "crispy-chicken-fry",
    description:
      "বিশেষ মসলা ও বাটারমিল্কে ম্যারিনেট করা বড় সাইজের চিকেন পিস, আমাদের সিক্রেট ক্রিস্পি কোটিংয়ে ডিপ-ফ্রাই করা। বাইরে কুরকুরে মচমচে আর ভেতরে নরম ও রসালো—সাথে টমেটো কেচাপ ও গার্লিক মেয়োনিজ।",
    price: 150,
    originalPrice: 180,
    category: "ফ্রাই ও ফাস্টফুড",
    collection: "মচমচে ফ্রাই ও ক্যাফে স্ন্যাকস",
    spiceLevel: 2,
    dietaryTags: ["হালাল", "বেস্টসেলার", "ছোট-বড় সবার প্রিয়"],
    images: [
      "/images/chicken-fry.jpg",
      "/images/naga-wings.jpg",
      "/images/peri-loaded-fries.jpg",
      "/images/hero-platter.jpg",
    ],
    badge: "স্পেশাল - ১৫০ টাকা",
    prepTimeMinutes: 12,
    calories: 480,
    servingSize: "২ পিস জাম্বো চিকেন + সস",
    availableAddons: [
      { id: "garlic-mayo", name: "স্পেশাল গার্লিক মেয়ো ডিপ", price: 25 },
      { id: "cheese-dip", name: "হট চিজ সস ডিপ", price: 35 },
      { id: "french-fries-side", name: "সাথে হাফ ফ্রেঞ্চ ফ্রাইজ", price: 60 },
    ],
    inStock: true,
    ratingAvg: "4.95",
    reviewCount: 4,
    reviews: [
      {
        customerName: "আরিফুল ইসলাম",
        customerTag: "চিকেন লাভার",
        rating: 5,
        comment:
          "১৫০ টাকায় এত বড় এবং জুসি চিকেন ফ্রাই সত্যিই অবাক করার মতো! গরম গরম গার্লিক মেয়োনিজের সাথে খেতে দারুণ লাগে।",
        spiceFeedback: "মচমচে ও পরিমিত ঝাল",
        helpfulCount: 22,
      },
      {
        customerName: "ফারহানা ইয়াসমিন",
        customerTag: "পারিবারিক গ্রাহক",
        rating: 5,
        comment:
          "আমার বাচ্চারা এখানকার চিকেন ফ্রাই ভীষণ পছন্দ করে। তেল চিটচিটে ভাব একদমই নেই, একদম ফ্রেশ।",
        spiceFeedback: "বাচ্চাদের উপযোগী",
        helpfulCount: 16,
      },
      {
        customerName: "মাহমুদুল হক",
        customerTag: "সান্ধ্য আড্ডা",
        rating: 5,
        comment:
          "চিকেন ফ্রাই আর কফি—বিকেলের নাস্তায় আমাদের সবচেয়ে প্রিয় কম্বিনেশন।",
        spiceFeedback: "একদম পারফেক্ট",
        helpfulCount: 9,
      },
      {
        customerName: "শামীম রেজা",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "কোটিংটা অনেকক্ষণ পর্যন্ত মচমচে থাকে। সাথে চিজ ডিপ নিলে স্বাদ দ্বিগুণ হয়ে যায়।",
        spiceFeedback: "দারুণ ক্রিস্পি",
        helpfulCount: 7,
      },
    ],
  },
  {
    name: "নরমাল চা",
    slug: "normal-tea",
    description:
      "সিলেটের বাছাইকৃত কড়া চায়ের পাতা, তাজা আদা ও সুগন্ধি এলাচ দিয়ে তৈরি খাঁটি দেশি দুধ চা কিংবা রং চা। মাত্র ২০ টাকায় সারাদিনের ক্লান্তি দূর করার মতো এক কাপ সতেজতা।",
    price: 20,
    originalPrice: 25,
    category: "চা ও কফি",
    collection: "ধোঁয়া ওঠা চা ও কফির চুমুক",
    spiceLevel: 0,
    dietaryTags: ["হালাল", "ভেজিটেরিয়ান", "সবচেয়ে সাশ্রয়ী"],
    images: [
      "/images/normal-tea.jpg",
      "/images/malai-tea.jpg",
      "/images/hot-coffee.jpg",
      "/images/fuchka-plate.jpg",
    ],
    badge: "মাত্র ২০ টাকা",
    prepTimeMinutes: 5,
    calories: 90,
    servingSize: "১ কাপ (গরম)",
    availableAddons: [
      { id: "ginger-clove", name: "কড়া আদা ও লবঙ্গ ফ্লেভার (রং চা)", price: 0 },
      { id: "extra-liquor", name: "কড়া লিকার ও কম চিনি", price: 0 },
      { id: "cookies-2pc", name: "সাথে ২ পিস বেকারি বিস্কুট", price: 15 },
    ],
    inStock: true,
    ratingAvg: "4.96",
    reviewCount: 4,
    reviews: [
      {
        customerName: "তানভীর আহমেদ",
        customerTag: "চা খোর",
        rating: 5,
        comment:
          "২০ টাকায় এত চমৎকার লিকার আর এলাচের ঘ্রাণওয়ালা চা পাওয়া ভাগ্যের ব্যাপার! প্রতিদিন বিকেলে অন্তত দুই কাপ খাওয়া চাই-ই।",
        spiceFeedback: "মিষ্টি ও সতেজ",
        helpfulCount: 31,
      },
      {
        customerName: "সৌম্য সরকার",
        customerTag: "বিশ্ববিদ্যালয় শিক্ষার্থী",
        rating: 5,
        comment:
          "পকেট ফাঁকা থাকলেও ২০ টাকার নরমাল চা আর ৭০ টাকার ফুচকা দিয়ে রাজকীয় আড্ডা হয়ে যায়।",
        spiceFeedback: "সেরা ভ্যালু",
        helpfulCount: 20,
      },
      {
        customerName: "মালিহা রহমান",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "আদা-লেবুর রং চা অপশনটাও দারুণ। গলা ব্যথা বা বৃষ্টির দিনে অমৃত মনে হয়।",
        spiceFeedback: "আদা-এলাচের ঘ্রাণ",
        helpfulCount: 12,
      },
      {
        customerName: "কামরুল হাসান",
        customerTag: "অফিস কর্মী",
        rating: 5,
        comment:
          "অফিস ছুটির পর এখানে দাঁড়িয়ে এক কাপ চা না খেলে দিনটা অসম্পূর্ণ মনে হয়।",
        spiceFeedback: "কড়া লিকার",
        helpfulCount: 8,
      },
    ],
  },
  {
    name: "মালাই চা",
    slug: "special-malai-tea",
    description:
      "অল্প আঁচে দীর্ঘক্ষণ জ্বাল দেওয়া ঘন দুধের সর (মালাই), কড়া চায়ের লিকার, জাফরান-এলাচের সুবাস এবং ওপরে কাজু-পেস্তা বাদাম কুচি ছড়ানো আমাদের ক্যাফের সিগনেচার মাটির কাপের মালাই চা।",
    price: 50,
    originalPrice: 65,
    category: "চা ও কফি",
    collection: "ধোঁয়া ওঠা চা ও কফির চুমুক",
    spiceLevel: 0,
    dietaryTags: ["হালাল", "ভেজিটেরিয়ান", "বেস্টসেলার"],
    images: [
      "/images/malai-tea.jpg",
      "/images/normal-tea.jpg",
      "/images/hot-coffee.jpg",
      "/images/churro-jalebi-sundae.jpg",
    ],
    badge: "সিগনেচার - ৫০ টাকা",
    prepTimeMinutes: 6,
    calories: 185,
    servingSize: "১ মাটির কাপ (ঘন মালাইসহ)",
    availableAddons: [
      { id: "extra-malai", name: "ডাবল দুধের সর (মালাই)", price: 20 },
      { id: "nut-topping", name: "অতিরিক্ত কাজু ও পেস্তা বাদাম কুচি", price: 15 },
      { id: "clay-cup-pack", name: "স্পেশাল মাটির কাপ প্যাকিং", price: 10 },
    ],
    inStock: true,
    ratingAvg: "4.99",
    reviewCount: 4,
    reviews: [
      {
        customerName: "মেহজাবীন চৌধুরী",
        customerTag: "মালাই চা ফ্যান",
        rating: 5,
        comment:
          "শেষ বিকেলের আড্ডার মালাই চা এক কথায় জাদুকরী! ওপরে মোটা দুধের সর আর বাদাম কুচি—৫০ টাকায় সেরা স্বাদ।",
        spiceFeedback: "ক্রিমি ও সুস্বাদু",
        helpfulCount: 35,
      },
      {
        customerName: "রাফসান জুবায়ের",
        customerTag: "ফুড ব্লগার",
        rating: 5,
        comment:
          "পুরান ঢাকার ঐতিহ্যবাহী মালাই চায়ের সেই আসল স্বাদ এখানে পাওয়া যায়। মাটির কাপে চুমুক দিলেই মন ভালো হয়ে যায়।",
        spiceFeedback: "খাঁটি মালাই",
        helpfulCount: 24,
      },
      {
        customerName: "সুমাইয়া ইসলাম",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "ফুচকার ঝাল খাওয়ার পর এক কাপ ঠান্ডা-গরম মালাই চা—এর চেয়ে ভালো বিকেল আর হতে পারে না!",
        spiceFeedback: "মিষ্টি ও ঘন",
        helpfulCount: 17,
      },
      {
        customerName: "ইমরান মাহমুদ",
        customerTag: "ক্যাফে প্রেমী",
        rating: 5,
        comment:
          "ডাবল মালাই অ্যাড করে অর্ডার করেছিলাম, প্রতি চুমুকে ঘন সরের স্বাদ পেয়েছি।",
        spiceFeedback: "অসাধারণ",
        helpfulCount: 13,
      },
    ],
  },
  {
    name: "কফি (হট ক্যাপুচিনো / মিল্ক কফি)",
    slug: "cafe-special-coffee",
    description:
      "রোস্টেড অ্যারাবিকা কফি বিনস ও ভেলভেটি ফেনা তোলা গরম দুধের সমন্বয়ে তৈরি ক্যাফে-স্টাইল রিচ কফি। ওপরে চকলেট পাউডার ও কফি আর্ট—বিকেলের আড্ডা কিংবা কাজের ফাঁকে চনমনে ভাব আনতে জুড়ি নেই।",
    price: 100,
    originalPrice: 120,
    category: "চা ও কফি",
    collection: "ধোঁয়া ওঠা চা ও কফির চুমুক",
    spiceLevel: 0,
    dietaryTags: ["হালাল", "ভেজিটেরিয়ান", "ক্যাফে স্পেশাল"],
    images: [
      "/images/hot-coffee.jpg",
      "/images/malai-tea.jpg",
      "/images/masala-boba-float.jpg",
      "/images/churro-jalebi-sundae.jpg",
    ],
    badge: "প্রিমিয়াম - ১০০ টাকা",
    prepTimeMinutes: 6,
    calories: 160,
    servingSize: "১ বড় মগ (২৫০ মি.লি.)",
    availableAddons: [
      { id: "cold-coffee-mode", name: "আইসড কোল্ড কফি হিসেবে নিন", price: 20 },
      { id: "chocolate-syrup", name: "এক্সট্রা ডার্ক চকলেট সিরাপ", price: 25 },
      { id: "extra-shot", name: "এক্সট্রা কড়া কফি শট", price: 30 },
    ],
    inStock: true,
    ratingAvg: "4.94",
    reviewCount: 4,
    reviews: [
      {
        customerName: "নাফিস ইকবাল",
        customerTag: "কফি লাভার",
        rating: 5,
        comment:
          "১০০ টাকায় এত ঘন ফেনা তোলা প্রিমিয়াম ক্যাপুচিনো কফি সচরাচর বড় ক্যাফে ছাড়া পাওয়া যায় না। কফির অ্যারোমাটা দুর্দান্ত!",
        spiceFeedback: "দারুণ অ্যারোমা",
        helpfulCount: 21,
      },
      {
        customerName: "প্রিয়া সেনগুপ্ত",
        customerTag: "ফ্রিল্যান্সার",
        rating: 5,
        comment:
          "চিকেন ফ্রাই আর এক মগ গরম কফি নিয়ে বসলে কাজের ক্লান্তি নিমিষেই দূর হয়ে যায়।",
        spiceFeedback: "রিচ ও ক্রিমি",
        helpfulCount: 15,
      },
      {
        customerName: "জাহিদ হাসান",
        customerTag: "সান্ধ্য আড্ডা",
        rating: 5,
        comment:
          "চকলেট সিরাপ অ্যাড করে কোল্ড কফি অপশনটাও ট্রাই করেছি—গরমের বিকেলে একদম রিফ্রেশিং!",
        spiceFeedback: "পারফেক্ট মিষ্টি",
        helpfulCount: 10,
      },
      {
        customerName: "রুবাইয়া তাবাসসুম",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "কফির কাপের সাইজ বেশ বড় এবং স্বাদ একদম অথেনটিক ক্যাফে স্টাইল।",
        spiceFeedback: "সেরা কফি",
        helpfulCount: 8,
      },
    ],
  },
  {
    name: "স্পেশাল দই ফুচকা (১ প্লেট)",
    slug: "special-doi-fuchka",
    description:
      "মচমচে ফুচকার ভেতরে মাসালা আলু-ছোলা পুর, ওপরে প্রচুর পরিমাণে মিষ্টি ও টক দইয়ের ক্রিমি মিশ্রণ, তেঁতুল-খেজুরের চাটনি, ঝুরিভাজা (চানাচুর), ধনেপাতা ও ভাজা মরিচের গুঁড়ো।",
    price: 120,
    originalPrice: 140,
    category: "ফুচকা ও চটপটি",
    collection: "বিকেলের ফুচকা ও চটপটি",
    spiceLevel: 1,
    dietaryTags: ["হালাল", "ভেজিটেরিয়ান", "ছোট-বড় সবার প্রিয়"],
    images: [
      "/images/doi-fuchka.jpg",
      "/images/fuchka-plate.jpg",
      "/images/chotpoti-bowl.jpg",
      "/images/hero-platter.jpg",
    ],
    badge: "দই ফুচকা - ১২০ টাকা",
    prepTimeMinutes: 8,
    calories: 390,
    servingSize: "১ প্লেট (৮ পিস)",
    availableAddons: [
      { id: "extra-sweet-doi", name: "অতিরিক্ত মিষ্টি দইয়ের লেয়ার", price: 25 },
      { id: "extra-sev", name: "অতিরিক্ত ঝুরিভাজা ও বাদাম", price: 15 },
    ],
    inStock: true,
    ratingAvg: "4.95",
    reviewCount: 3,
    reviews: [
      {
        customerName: "আনিকা তাবাসসুম",
        customerTag: "দই ফুচকা ভক্ত",
        rating: 5,
        comment:
          "যারা খুব বেশি ঝাল খেতে পারেন না তাদের জন্য এই দই ফুচকাটা স্বর্গীয়! দইটা এত ঘন আর সুস্বাদু যে মুখে দিলেই মিলিয়ে যায়।",
        spiceFeedback: "টক-মিষ্টি ও মৃদু ঝাল",
        helpfulCount: 18,
      },
      {
        customerName: "তারিক আজিজ",
        customerTag: "পারিবারিক গ্রাহক",
        rating: 5,
        comment:
          "বাসার সবার জন্য অর্ডার করেছিলাম। ঝুরিভাজা আর তেঁতুল চাটনির ব্যালেন্সটা চমৎকার।",
        spiceFeedback: "সবার উপযোগী",
        helpfulCount: 12,
      },
      {
        customerName: "শ্রাবণী রায়",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "১২০ টাকায় ভরপুর এক প্লেট দই ফুচকা, স্বাদ ও পরিমাণে একশোতে একশো!",
        spiceFeedback: "ক্রিমি স্বাদ",
        helpfulCount: 9,
      },
    ],
  },
  {
    name: "মসলাদার চটপটি (ডিম ও ফুচকা ক্রাশসহ)",
    slug: "special-masala-chotpoti",
    description:
      "নরম সিদ্ধ ডাবলি ছোলা ও আলু, আমাদের নিজস্ব ভাজা চটপটি মসলা, কাঁচামরিচ, পেঁয়াজ কুচি, তেঁতুলের টক এবং ওপরে মচমচে ভাঙা ফুচকা ও সিদ্ধ ডিমের গ্রেটিং দিয়ে গরম গরম পরিবেশিত।",
    price: 80,
    originalPrice: 100,
    category: "ফুচকা ও চটপটি",
    collection: "বিকেলের ফুচকা ও চটপটি",
    spiceLevel: 2,
    dietaryTags: ["হালাল", "স্ট্রিট ক্লাসিক", "বেস্টসেলার"],
    images: [
      "/images/chotpoti-bowl.jpg",
      "/images/fuchka-plate.jpg",
      "/images/doi-fuchka.jpg",
      "/images/hero-platter.jpg",
    ],
    badge: "১ বাটি - ৮০ টাকা",
    prepTimeMinutes: 7,
    calories: 350,
    servingSize: "১ ফুল বাটি",
    availableAddons: [
      { id: "extra-fuchka-top", name: "ওপরে ৩টি মচমচে ফুচকা ক্রাশ", price: 20 },
      { id: "extra-egg-top", name: "ফুল ১টি সিদ্ধ ডিম গ্রেটিং", price: 20 },
    ],
    inStock: true,
    ratingAvg: "4.92",
    reviewCount: 3,
    reviews: [
      {
        customerName: "ফয়সাল করিম",
        customerTag: "চটপটি লাভার",
        rating: 5,
        comment:
          "গরম গরম চটপটির ওপরে মচমচে ফুচকা ভেঙে আর ডিম কুচি দিয়ে খাওয়ার মজাই আলাদা! মাত্র ৮০ টাকায় পেট ভরা নাস্তা।",
        spiceFeedback: "চমৎকার ঝাল-টক",
        helpfulCount: 15,
      },
      {
        customerName: "শারমিন সুলতানা",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "চটপটির মসলার ঘ্রাণটা একদম ঘরোয়া ও ফ্রেশ। সাথে এক কাপ মালাই চা নিলে আড্ডা জমে ক্ষীর!",
        spiceFeedback: "পারফেক্ট ঝাল",
        helpfulCount: 11,
      },
      {
        customerName: "মনিরুল ইসলাম",
        customerTag: "ফুডি",
        rating: 5,
        comment:
          "পরিমাণ বেশ অনেকখানি, তেঁতুলের টক আলাদা দেওয়ায় নিজের ইচ্ছেমতো মিলিয়ে খাওয়া যায়।",
        spiceFeedback: "স্বাদে সেরা",
        helpfulCount: 7,
      },
    ],
  },
  {
    name: "ক্রিস্পি চিকেন মোমো (৬ পিস)",
    slug: "crispy-chicken-momos-6pc",
    description:
      "আদা-রসুন ও ধনেপাতা মাখানো জুসি চিকেন কিমার পুর ভরা ৬ পিস ডাম্পলিং মোমো, মচমচে কর্নফ্লেক্স কোটিংয়ে গোল্ডেন ফ্রাই করা (অথবা স্টিমড)। সাথে থাকছে ঝাল লাল মরিচ চাটনি ও মেয়ো ডিপ।",
    price: 160,
    originalPrice: 190,
    category: "মোমো ও চাউমিন",
    collection: "বন্ধুদের আড্ডা কম্বো",
    spiceLevel: 2,
    dietaryTags: ["হালাল", "ক্যাফে ফেভারিট", "বেস্টসেলার"],
    images: [
      "/images/crispy-momos.jpg",
      "/images/chicken-fry.jpg",
      "/images/naga-wings.jpg",
      "/images/adda-platter-box.jpg",
    ],
    badge: "৬ পিস - ১৬০ টাকা",
    prepTimeMinutes: 12,
    calories: 460,
    servingSize: "৬ পিস + ২ রকমের সস",
    availableAddons: [
      { id: "steamed-style", name: "নরম স্টিমড মোমো হিসেবে নিন", price: 0 },
      { id: "melted-cheese", name: "ওপরে গলানো চিজ লেয়ার", price: 40 },
      { id: "extra-chili-dip", name: "অতিরিক্ত নাগা চিলি সস", price: 20 },
    ],
    inStock: true,
    ratingAvg: "4.96",
    reviewCount: 3,
    reviews: [
      {
        customerName: "সামিরা কবির",
        customerTag: "মোমো প্রেমী",
        rating: 5,
        comment:
          "কুরকুরে ফ্রাইড মোমোগুলো এত ক্রিস্পি আর ভেতরে এত জুসি চিকেন থাকে যে ৬ পিস কখন শেষ হয়ে যায় টেরই পাওয়া যায় না!",
        spiceFeedback: "ঝাল চাটনির সাথে সেরা",
        helpfulCount: 20,
      },
      {
        customerName: "রাহাত চৌধুরী",
        customerTag: "কলেজ আড্ডা",
        rating: 5,
        comment:
          "ওপরে গলানো চিজ লেয়ার অ্যাড করে নিলে স্বাদ অন্য লেভেলে চলে যায়। ১৬০ টাকায় সেরা ডিল।",
        spiceFeedback: "চিজি ও স্পাইসি",
        helpfulCount: 14,
      },
      {
        customerName: "তাসনিম ফেরদৌস",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "সস দুটোই অসাধারণ—একটা ঝাল লাল চাটনি আর অন্যটা ক্রিমি গার্লিক মেয়ো।",
        spiceFeedback: "একদম ঠিকঠাক",
        helpfulCount: 9,
      },
    ],
  },
  {
    name: "স্পেশাল বিফ স্ম্যাশ চিজ বার্গার",
    slug: "special-beef-smash-cheese-burger",
    description:
      "তাজা বিফ প্যাটি গ্রিল করে ওপরে ডাবল মেল্টেড চেডার চিজ, ক্যারামেলাইজড পেঁয়াজ, টমেটো, শসা এবং আমাদের ক্যাফের স্পেশাল স্মোকি সস দিয়ে বাটার-টোস্ট করা নরম বার্গার বানে পরিবেশিত।",
    price: 220,
    originalPrice: 260,
    category: "ফ্রাই ও ফাস্টফুড",
    collection: "মচমচে ফ্রাই ও ক্যাফে স্ন্যাকস",
    spiceLevel: 2,
    dietaryTags: ["হালাল", "চিজ লাভার", "ক্যাফে ক্লাসিক"],
    images: [
      "/images/smash-burger.jpg",
      "/images/peri-loaded-fries.jpg",
      "/images/chicken-fry.jpg",
      "/images/hero-platter.jpg",
    ],
    badge: "চিজ বার্গার - ২২০ টাকা",
    prepTimeMinutes: 14,
    calories: 640,
    servingSize: "১টি জাম্বো বার্গার",
    availableAddons: [
      { id: "extra-cheese-slice", name: "ডাবল চিজ স্লাইস", price: 30 },
      { id: "egg-poach", name: "ভেতরে ফ্রাইড ডিম পোচ", price: 25 },
      { id: "fries-combo", name: "সাথে ফ্রেঞ্চ ফ্রাইজ ও চা কম্বো", price: 100 },
    ],
    inStock: true,
    ratingAvg: "4.93",
    reviewCount: 3,
    reviews: [
      {
        customerName: "আশফাকুর রহমান",
        customerTag: "বার্গার লাভার",
        rating: 5,
        comment:
          "২২০ টাকায় এত চিজি এবং জুসি বিফ স্ম্যাশ বার্গার! বার্গারের বানটা একদম নরম ও বাটারি।",
        spiceFeedback: "স্মোকি ও সুস্বাদু",
        helpfulCount: 17,
      },
      {
        customerName: "নাবিলা নূর",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "ভেতরে ডিম পোচ আর ডাবল চিজ নিলে একটা বার্গারেই রাতের ডিনার হয়ে যায়।",
        spiceFeedback: "সবার পছন্দ",
        helpfulCount: 12,
      },
      {
        customerName: "জায়ান চৌধুরী",
        customerTag: "শিক্ষার্থী",
        rating: 5,
        comment:
          "ক্যাফের সিক্রেট বার্গার সসটা দারুণ মজার।",
        spiceFeedback: "পারফেক্ট",
        helpfulCount: 8,
      },
    ],
  },
  {
    name: "চিকেন চাউমিন (ক্যাফে স্পেশাল)",
    slug: "cafe-special-chicken-chowmein",
    description:
      "হাই-ফ্লেম ওকে টস করা নুডলসের সাথে ম্যারিনেটেড চিকেন স্ট্রিপস, ডিমের স্ক্র্যাম্বল, গাজর, ক্যাপসিকাম, বাঁধাকপি, কাঁচামরিচ ও সয়া-গার্লিক সস—ক্যাফেতে বসে বা বাসায় আড্ডার দারুণ খাবার।",
    price: 180,
    originalPrice: 210,
    category: "মোমো ও চাউমিন",
    collection: "বন্ধুদের আড্ডা কম্বো",
    spiceLevel: 1,
    dietaryTags: ["হালাল", "ছোট-বড় সবার প্রিয়", "ক্যাফে ফেভারিট"],
    images: [
      "/images/chowmein.jpg",
      "/images/crispy-momos.jpg",
      "/images/chicken-fry.jpg",
      "/images/adda-platter-box.jpg",
    ],
    badge: "ফুল প্লেট - ১৮০ টাকা",
    prepTimeMinutes: 12,
    calories: 520,
    servingSize: "১ ফুল বক্স (১-২ জনের জন্য)",
    availableAddons: [
      { id: "extra-chicken", name: "অতিরিক্ত চিকেন ও ডিম", price: 40 },
      { id: "fried-wonton", name: "ওপরে ২ পিস ক্রিস্পি চিকেন ফ্রাই", price: 130 },
    ],
    inStock: true,
    ratingAvg: "4.91",
    reviewCount: 3,
    reviews: [
      {
        customerName: "সাদিয়া আফরিন",
        customerTag: "চাউমিন ভক্ত",
        rating: 5,
        comment:
          "চিকেন ও সবজির পরিমাণ প্রচুর! ১৮০ টাকার একটা বক্স দুজনে মিলে অনায়াসে খাওয়া যায়।",
        spiceFeedback: "হালকা ঝাল ও সুস্বাদু",
        helpfulCount: 16,
      },
      {
        customerName: "তৌহিদুল ইসলাম",
        customerTag: "পারিবারিক গ্রাহক",
        rating: 5,
        comment:
          "চাউমিনের স্মোকি ফ্লেভারটা একদম রেস্তোরাঁ কোয়ালিটির। বাচ্চারাও খুব মজা করে খায়।",
        spiceFeedback: "বাচ্চাদের প্রিয়",
        helpfulCount: 11,
      },
      {
        customerName: "রুম্পা খাতুন",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "চিকেন ফ্রাইয়ের সাথে এই চাউমিনটা অর্ডার করলে পূর্ণাঙ্গ ডিনার হয়ে যায়।",
        spiceFeedback: "দারুণ স্বাদ",
        helpfulCount: 8,
      },
    ],
  },
  {
    name: "পেরি-পেরি লোডেড ফ্রেঞ্চ ফ্রাইজ",
    slug: "peri-peri-loaded-french-fries",
    description:
      "মচমচে গোল্ডেন ফ্রেঞ্চ ফ্রাইজের ওপরে চটপটা পেরি-পেরি মসলা, গরম চিজ সস এবং গার্লিক মেয়োনিজের লেয়ার। চা কিংবা কফির সাথে টুকটাক মুখ চালানোর জন্য সেরা ক্যাফে স্ন্যাকস।",
    price: 110,
    originalPrice: 130,
    category: "ফ্রাই ও ফাস্টফুড",
    collection: "মচমচে ফ্রাই ও ক্যাফে স্ন্যাকস",
    spiceLevel: 1,
    dietaryTags: ["হালাল", "ভেজিটেরিয়ান", "ছোট-বড় সবার প্রিয়"],
    images: [
      "/images/peri-loaded-fries.jpg",
      "/images/korean-corn-dog.jpg",
      "/images/chicken-fry.jpg",
      "/images/smash-burger.jpg",
    ],
    badge: "লোডেড - ১১০ টাকা",
    prepTimeMinutes: 8,
    calories: 410,
    servingSize: "১ বড় ট্রে",
    availableAddons: [
      { id: "extra-cheese-pour", name: "এক্সট্রা চিজ সস টপিং", price: 30 },
      { id: "crispy-chicken-bits", name: "ওপরে ক্রিস্পি চিকেন কুচি", price: 50 },
    ],
    inStock: true,
    ratingAvg: "4.90",
    reviewCount: 3,
    reviews: [
      {
        customerName: "মেহেরাব হোসেন",
        customerTag: "স্ন্যাকস প্রেমী",
        rating: 5,
        comment:
          "১১০ টাকায় চিজ ও মেয়োনিজ দেওয়া পেরি-পেরি ফ্রাইজ! কফির সাথে খেতে জাস্ট অসাধারণ।",
        spiceFeedback: "হালকা চটপটা",
        helpfulCount: 14,
      },
      {
        customerName: "দিবা চৌধুরী",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "ফ্রাইজগুলো একদম মচমচে আর গরম অবস্থায় ডেলিভারি পেয়েছি।",
        spiceFeedback: "ক্রিস্পি ও চিজি",
        helpfulCount: 10,
      },
      {
        customerName: "সাব্বির আহমেদ",
        customerTag: "কলেজ শিক্ষার্থী",
        rating: 4,
        comment:
          "ওপরে ক্রিস্পি চিকেন কুচি অ্যাড করে নিলে আরও ভরপুর লাগে।",
        spiceFeedback: "মজাদার",
        helpfulCount: 6,
      },
    ],
  },
  {
    name: "শেষ বিকেলের আড্ডা মেগা কম্বো প্লাটার",
    slug: "shesh-bikeler-adda-mega-combo",
    description:
      "বন্ধুদের দল কিংবা পরিবারের সবার জন্য আমাদের অল-ইন-ওয়ান আড্ডা বক্স! এতে থাকছে: ১ প্লেট ফুচকা, ২ পিস চিকেন ফ্রাই, ৪ পিস ক্রিস্পি মোমো, পেরি-পেরি ফ্রেঞ্চ ফ্রাইজ এবং ২ কাপ স্পেশাল মালাই চা।",
    price: 450,
    originalPrice: 550,
    category: "আড্ডা প্লাটার",
    collection: "বন্ধুদের আড্ডা কম্বো",
    spiceLevel: 2,
    dietaryTags: ["হালাল", "গ্রুপ শেয়ারিং", "বেস্টসেলার"],
    images: [
      "/images/adda-platter-box.jpg",
      "/images/hero-platter.jpg",
      "/images/fuchka-plate.jpg",
      "/images/chicken-fry.jpg",
    ],
    badge: "মেগা কম্বো - ৪৫০ টাকা",
    prepTimeMinutes: 16,
    calories: 1450,
    servingSize: "৩-৪ জনের আড্ডার জন্য",
    availableAddons: [
      { id: "add-2-normal-tea", name: "অতিরিক্ত ২ কাপ নরমাল চা", price: 40 },
      { id: "add-1-coffee", name: "সাথে ১ মগ গরম কফি", price: 90 },
      { id: "extra-fuchka-plate", name: "অতিরিক্ত ১ প্লেট ফুচকা", price: 65 },
    ],
    inStock: true,
    ratingAvg: "4.99",
    reviewCount: 4,
    reviews: [
      {
        customerName: "মুনতাহা আলম",
        customerTag: "আড্ডা স্কোয়াড হোস্ট",
        rating: 5,
        comment:
          "এই ৪৫০ টাকার কম্বো প্লাটারটা সেরা আবিষ্কার! ফুচকা, চিকেন ফ্রাই, মোমো, ফ্রাইজ আর মালাই চা—এক বক্সেই সবার পছন্দের সব খাবার থাকে।",
        spiceFeedback: "সবার জন্য পারফেক্ট",
        helpfulCount: 33,
      },
      {
        customerName: "শফিকুল বারী",
        customerTag: "পারিবারিক আড্ডা",
        rating: 5,
        comment:
          "শুক্রবার বিকেলে বাসার সবার জন্য এই প্লাটারটা অর্ডার করি। আলাদা করে আর কিছুই ভাবতে হয় না, দামও অনেক সাশ্রয়ী!",
        spiceFeedback: "সেরা কম্বো",
        helpfulCount: 25,
      },
      {
        customerName: "রিফাত আনোয়ার",
        customerTag: "বিশ্ববিদ্যালয় দল",
        rating: 5,
        comment:
          "চার বন্ধু মিলে খাওয়ার জন্য এর চেয়ে ভালো ও সাশ্রয়ী কম্বো আর হতেই পারে না।",
        spiceFeedback: "ভরপুর আয়োজন",
        helpfulCount: 18,
      },
      {
        customerName: "তানিয়া ইসলাম",
        customerTag: "নিয়মিত গ্রাহক",
        rating: 5,
        comment:
          "প্রতিটি খাবার আলাদা কম্পার্টমেন্টে সুন্দরভাবে সাজানো থাকে। মালাই চা-টাও ফ্লাস্ক কাপে গরম গরম আসে!",
        spiceFeedback: "অসাধারণ প্যাকিং",
        helpfulCount: 14,
      },
    ],
  },
];
