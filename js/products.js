// បញ្ជីទំនិញគ្រឿងក្រអូបហាង ស្រីល័ក្ខ (Sreyleak Beauty Store)
// ប្រភេទ៖ សក់ (Hair), មុខ (Face), ស្បែក (Skin), ដងខ្លួន (Body)

const PRODUCTS = [
  // ================= ថែរក្សាសក់ (HAIR CARE) =================
  {
    id: "hair-01",
    name: "សេរ៉ូមបណ្តុះសក់ & កាត់បន្ថយសក់ជ្រុះ Ginseng Hair Serum",
    category: "hair",
    categoryName: "ថែរក្សាសក់",
    priceUSD: 12.00,
    priceKHR: 48000,
    oldPriceUSD: 15.00,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
    badge: "លក់ដាច់បំផុត",
    rating: 4.9,
    reviews: 128,
    size: "50 ml",
    inStock: true,
    description: "សេរ៉ូមផ្សំពីឫសយិនស៊ិនធម្មជាតិ ជួយភ្ញោចឫសសក់ឱ្យដុះក្រាស់ កាត់បន្ថយការជ្រុះសក់ និងបំបាត់អង្គែយ៉ាងមានប្រសិទ្ធភាព។",
    benefits: [
      "ភ្ញោចឫសសក់ ជួយឱ្យសក់ដុះថ្មីលឿន",
      "កាត់បន្ថយការជ្រុះសក់រហូតដល់ ៨០%",
      "បំប៉នគល់សក់ឱ្យរឹងមាំ មិនងាយដាច់",
      "ក្លិនក្រអូបប្រហើរស្រស់ស្រាយជាប់បានយូរ"
    ],
    usage: "លាបលើស្បែកក្បាល ២-៣ ដំណក់ក្រោយកក់សក់រួច រួចម៉ាស្សាថ្នមៗដោយមិនបាច់លាងទឹកចេញ។"
  },
  {
    id: "hair-02",
    name: "សាប៊ូកក់សក់ធម្មជាតិ Argan Oil Moisture Shampoo",
    category: "hair",
    categoryName: "ថែរក្សាសក់",
    priceUSD: 8.50,
    priceKHR: 34000,
    oldPriceUSD: 10.00,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
    badge: "ពេញនិយម",
    rating: 4.8,
    reviews: 95,
    size: "400 ml",
    inStock: true,
    description: "សាប៊ូកក់សក់សំបូរដោយប្រេង Argan ធម្មជាតិ ជួយព្យាបាលសក់ខូចដោយសារការលាបពណ៌ កម្ដៅ និងធ្វើឱ្យសក់ទន់រលោងដូចសូត្រ។",
    benefits: [
      "ផ្តល់សំណើមខ្ពស់ដល់សរសៃសក់ស្ងួតបែកចុង",
      "កាត់បន្ថយសក់ជំពាក់ ងាយស្រួលសិត",
      "គ្មានជាតិគីមីកាត់ Sulfate និង Paraben",
      "ស័ក្តិសមសម្រាប់សក់លាបពណ៌ ឬកៀបត្រង់ញឹកញាប់"
    ],
    usage: "លាបលើសក់សើម ម៉ាស្សាឱ្យសព្វស្បែកក្បាល រួចលាងជម្រះដោយទឹកស្អាត។"
  },
  {
    id: "hair-03",
    name: "ម៉ាស់អប់សក់ Collagen Keratin Hair Treatment",
    category: "hair",
    categoryName: "ថែរក្សាសក់",
    priceUSD: 9.00,
    priceKHR: 36000,
    oldPriceUSD: 11.50,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    badge: "ទើបមកដល់",
    rating: 4.9,
    reviews: 74,
    size: "500 ml",
    inStock: true,
    description: "គ្រីមអប់សក់សារធាតុខូឡាជែន និង Keratin ស្តារសក់ខូចធ្ងន់ធ្ងរឱ្យមានទម្ងន់ រលោងស្អាត និងភ្លឺថ្លាពីគល់ដល់ចុង។",
    benefits: [
      "ជួសជុលសរសៃសក់ខូច និងស្តើង",
      "សក់ទន់រលោងមានទម្ងន់ មិនហើរ",
      "ការពារកម្ដៅថ្ងៃ និងកម្ដៅម៉ាស៊ីនកៀបសក់"
    ],
    usage: "ក្រោយកក់សក់រួច លាបគ្រីមលើសក់ពីពាក់កណ្តាលដល់ចុង ទុកចោល ៥-១០ នាទី រួចលាងចេញ។"
  },
  {
    id: "hair-04",
    name: "ប្រេងលាបចុងសក់ស្ងួតបែកចុង Camellia Hair Oil",
    category: "hair",
    categoryName: "ថែរក្សាសក់",
    priceUSD: 7.00,
    priceKHR: 28000,
    oldPriceUSD: 8.50,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80",
    badge: "",
    rating: 4.7,
    reviews: 63,
    size: "80 ml",
    inStock: true,
    description: "ប្រេងផ្កា Camellia ជួយបំប៉នចុងសក់ដែលស្ងួតក្រៀម មិនស្អិតដៃ ផ្តល់ពន្លឺចែងចាំង និងក្លិនក្រអូបផ្អែមស្រទន់ពេញមួយថ្ងៃ។",
    benefits: [
      "ស្រូបចូលសក់លឿន មិនកកស្អិត",
      "បំបាត់បញ្ហាសក់បែកចុងភ្លាមៗ",
      "ការពារសក់ពីធូលីដី និងផ្សែងអ័ព្ទ"
    ],
    usage: "បន្តក់ ១-២ ដំណក់លើបាតដៃ រួចលាបលើចុងសក់សើមឬស្ងួត។"
  },

  // ================= ថែរក្សាផ្ទៃមុខ (FACE CARE) =================
  {
    id: "face-01",
    name: "ហ្វូមលាងមុខខូឡាជែន Collagen Deep Cleansing Foam",
    category: "face",
    categoryName: "ថែរក្សាផ្ទៃមុខ",
    priceUSD: 6.50,
    priceKHR: 26000,
    oldPriceUSD: 8.00,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    badge: "លក់ដាច់បំផុត",
    rating: 5.0,
    reviews: 210,
    size: "150 ml",
    inStock: true,
    description: "ហ្វូមលាងមុខពពុះម៉ត់ខាប់ លាងសម្អាតជាតិកខ្វក់ជ្រៅដល់គល់រន្ធញើស កាត់បន្ថយមុនខ្យង មុនក្បាលខ្មៅ និងរក្សាសំណើមស្បែកមុខ។",
    benefits: [
      "លាងសម្អាតស្បែកមុខបានស្អាតល្អ មិនតឹងស្បែក",
      "ជួយឱ្យស្បែកមុខទន់ ភ្លឺថ្លាតាមបែបធម្មជាតិ",
      "កាត់បន្ថយប្រេងលើផ្ទៃមុខពេញមួយថ្ងៃ",
      "ស័ក្តិសមសម្រាប់គ្រប់ប្រភេទស្បែក"
    ],
    usage: "ច្របាច់ហ្វូមលើបាតដៃបង្កើតជាពពុះ ម៉ាស្សាថ្នមៗលើផ្ទៃមុខ រួចលាងទឹកចេញ។"
  },
  {
    id: "face-02",
    name: "សេរ៉ូមបំបាត់ជាំ ស្នាមមុន & អាចម៍រុយ Niacinamide + Alpha Arbutin",
    category: "face",
    categoryName: "ថែរក្សាផ្ទៃមុខ",
    priceUSD: 14.00,
    priceKHR: 56000,
    oldPriceUSD: 18.00,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    badge: "ពេញនិយម",
    rating: 4.9,
    reviews: 185,
    size: "30 ml",
    inStock: true,
    description: "រូបមន្តពិសេសជួយកម្ចាត់ស្នាមជាំ អាចម៍រុយ ស្នាមអុចខ្មៅពីមុន និងជួយឱ្យស្បែកមុខសភ្លឺថ្លាស្មើពណ៌គ្នាយ៉ាងលឿន។",
    benefits: [
      "កាត់បន្ថយស្នាមជាំ និងអាចម៍រុយឃើញលទ្ធផលក្នុង ២ សប្តាហ៍",
      "បង្រួមរន្ធញើសឱ្យម៉ត់រលោង",
      "បង្កើនភាពតឹងណែន និងភ្លឺថ្លា"
    ],
    usage: "លាបលើផ្ទៃមុខព្រឹក និងយប់ក្រោយពេលលាងមុខ និងជូតទឹក Toner រួច។"
  },
  {
    id: "face-03",
    name: "ឡេការពារកម្តៅថ្ងៃ SPF50+ PA++++ Invisible Sunscreen",
    category: "face",
    categoryName: "ថែរក្សាផ្ទៃមុខ",
    priceUSD: 11.00,
    priceKHR: 44000,
    oldPriceUSD: 13.50,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    badge: "ទើបមកដល់",
    rating: 4.8,
    reviews: 92,
    size: "50 ml",
    inStock: true,
    description: "សាច់ឡេស្រាលដូចទឹក មិនកកស្អិត មិនសស្ញាញ ការពារកាំរស្មី UVA/UVB បានពេញលេញ និងជួយទប់ជាតិប្រេងបាន ១២ ម៉ោង។",
    benefits: [
      "ការពារកម្តៅថ្ងៃកម្រិតខ្ពស់ SPF50+ PA++++",
      "សាច់គ្រីមជ្រាបចូលស្បែកភ្លាមៗ គ្មានជាតិកកស្អិត",
      "មិនបណ្តាលឱ្យកើតមុន ឬស្ទះរន្ធញើស",
      "អាចប្រើជំនួស Primer មុនផាត់មុខបាន"
    ],
    usage: "លាបលើផ្ទៃមុខមុនពេលចេញក្រៅកម្តៅថ្ងៃ ១៥-២០ នាទី។"
  },
  {
    id: "face-04",
    name: "គ្រីមបំប៉នយប់ Whitening Night Repair Cream",
    category: "face",
    categoryName: "ថែរក្សាផ្ទៃមុខ",
    priceUSD: 13.50,
    priceKHR: 54000,
    oldPriceUSD: 16.00,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    badge: "",
    rating: 4.8,
    reviews: 88,
    size: "50 g",
    inStock: true,
    description: "គ្រីមបំប៉នពេលយប់ ស្តារស្បែកមុខហត់នឿយ ជួយឱ្យស្បែកមុខតឹងណែន ម៉ត់រលោង និងសភ្លឺចែងចាំងនៅពេលភ្ញាក់ពីគេង។",
    benefits: [
      "ជួសជុលកោសិកាស្បែកចាស់ពេលគេងលក់",
      "ផ្តល់សំណើមជ្រៅពេញ ២៤ ម៉ោង",
      "កាត់បន្ថយស្នាមជ្រីវជ្រួញជុំវិញភ្នែក និងថ្ពាល់"
    ],
    usage: "លាបលើផ្ទៃមុខ និងកជារៀងរាល់យប់មុនចូលគេង។"
  },

  // ================= ថែរក្សាស្បែក (SKIN CARE) =================
  {
    id: "skin-01",
    name: "សេរ៉ូមវីតាមីន C ធម្មជាតិ Pure Vitamin C Glow Serum",
    category: "skin",
    categoryName: "ថែរក្សាស្បែក",
    priceUSD: 13.00,
    priceKHR: 52000,
    oldPriceUSD: 16.50,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=600",
    badge: "លក់ដាច់បំផុត",
    rating: 4.9,
    reviews: 160,
    size: "30 ml",
    inStock: true,
    description: "សេរ៉ូមវីតាមីន C កំហាប់ខ្ពស់ ជួយបំប៉នស្បែកឱ្យភ្លឺថ្លា បំបាត់ភាពស្រអាប់ និងជម្រុះកោសិកាចាស់ៗយ៉ាងសុភាព។",
    benefits: [
      "ជួយឱ្យស្បែកភ្លឺថ្លាមានសំណើមបែបធម្មជាតិ",
      "កាត់បន្ថយស្នាមអុចខ្មៅ និងស្នាមជាំ",
      "ប្រឆាំងរ៉ាឌីកាល់សេរី ការពារភាពចាស់នៃស្បែក"
    ],
    usage: "លាប ២-៣ ដំណក់លើស្បែកមុខ និងក រាល់ព្រឹក-ល្ងាច។"
  },
  {
    id: "skin-02",
    name: "ទឹកជូតសម្អាត & ផ្តល់សំណើម Rose Water Hydrating Toner",
    category: "skin",
    categoryName: "ថែរក្សាស្បែក",
    priceUSD: 7.50,
    priceKHR: 30000,
    oldPriceUSD: 9.50,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600",
    badge: "ពេញនិយម",
    rating: 4.8,
    reviews: 112,
    size: "200 ml",
    inStock: true,
    description: "Toner ទឹកផ្កាកុលាបធម្មជាតិ ជួយថ្លឹងជាតិកាត់ pH លើស្បែក បង្រួមរន្ធញើស និងត្រៀមស្បែកឱ្យស្រូបយកសេរ៉ូមបានល្អ។",
    benefits: [
      "ផ្តល់សំណើមស្រស់ស្រាយភ្លាមៗ",
      "បន្ធូរបន្ថយស្បែករោលក្រហម",
      "ក្លិនផ្កាកុលាបក្រអូបបែបធម្មជាតិ"
    ],
    usage: "ចាក់លើសំឡី រួចជូតថ្នមៗលើផ្ទៃមុខក្រោយលាងមុខរួច។"
  },
  {
    id: "skin-03",
    name: "ម៉ាស់បិទមុខខូឡាជែន Collagen Sheet Mask (ប្រអប់ ១០ សន្លឹក)",
    category: "skin",
    categoryName: "ថែរក្សាស្បែក",
    priceUSD: 8.00,
    priceKHR: 32000,
    oldPriceUSD: 10.00,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    badge: "បញ្ចុះតម្លៃ",
    rating: 4.9,
    reviews: 140,
    size: "10 Sheets/Box",
    inStock: true,
    description: "ម៉ាស់បិទមុខសំបូរដោយទឹកសេរ៉ូមខូឡាជែន ជួយឱ្យស្បែកទន់ម៉ត់រលោង តឹងណែន ភ្លឺថ្លាតាំងពីប្រើលើកដំបូង។",
    benefits: [
      "ផ្តល់ជាតិទឹកដល់ស្បែកស្ងួតខ្លាំង",
      "ជួយឱ្យស្បែកមុខរលោងម៉ត់ទន់ដូចស្បែកកូនក្មេង",
      "បិទ ១៥-២០ នាទី មិនបាច់លាងទឹកចេញ"
    ],
    usage: "បិទលើផ្ទៃមុខ ១៥-២០ នាទី រួចដោះចេញហើយទះថ្នមៗឱ្យសេរ៉ូមជ្រាបចូល។"
  },
  {
    id: "skin-04",
    name: "ជែលប្រទាលកន្ទុយក្រពើ 99% Aloe Vera Soothing Gel",
    category: "skin",
    categoryName: "ថែរក្សាស្បែក",
    priceUSD: 5.00,
    priceKHR: 20000,
    oldPriceUSD: 6.50,
    image: "https://images.unsplash.com/photo-1598662779094-110c2bad80b5?w=600",
    badge: "",
    rating: 4.7,
    reviews: 78,
    size: "300 ml",
    inStock: true,
    description: "ជែលប្រទាលកន្ទុយក្រពើធម្មជាតិ ៩៩% ជួយបំបាត់ការរលាកកម្តៅថ្ងៃ ផ្តល់សំណើមដល់ស្បែកមុខ និងដងខ្លួន ត្រជាក់ស្រួល។",
    benefits: [
      "បំបាត់ស្បែករលាកក្រហាយថ្ងៃ",
      "ផ្តល់សំណើមដោយមិនកកស្អិត",
      "អាចប្រើលើមុខ ស្បែកខ្លួន និងសក់បានទាំងអស់"
    ],
    usage: "លាបលើស្បែកស្ងួត ឬរលាកកម្តៅថ្ងៃតាមតម្រូវការ។"
  },

  // ================= ថែរក្សាដងខ្លួន (BODY CARE) =================
  {
    id: "body-01",
    name: "ឡេលាបស្បែកដងខ្លួនសភ្លឺថ្លា Glutathione & Kojic Body Lotion",
    category: "body",
    categoryName: "ថែរក្សាដងខ្លួន",
    priceUSD: 10.50,
    priceKHR: 42000,
    oldPriceUSD: 13.00,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80",
    badge: "លក់ដាច់បំផុត",
    rating: 5.0,
    reviews: 240,
    size: "400 ml",
    inStock: true,
    description: "ឡេបំប៉នស្បែកដងខ្លួនផ្សំពី Glutathione និង Kojic Acid ជួយឱ្យស្បែកសភ្លឺថ្លាស្មើពណ៌ កាត់បន្ថយស្នាមអុចខ្មៅ និងការពារកម្តៅថ្ងៃ។",
    benefits: [
      "ស្បែកសភ្លឺថ្លាមើលឃើញក្នុងរយៈពេល ៧ ថ្ងៃ",
      "ក្លិនក្រអូបផ្អែមស្រទន់ ជាប់បានយូរ ១២ ម៉ោង",
      "សាច់ឡេជ្រាបលឿន មិនកកស្អិតខោអាវ",
      "ជួយឱ្យស្បែកទន់រលោងម៉ត់ខៃ"
    ],
    usage: "លាបលើដងខ្លួនព្រឹក-ល្ងាច ក្រោយពេលងូតទឹករួច។"
  },
  {
    id: "body-02",
    name: "ស្ក្រាប់ខាត់ស្បែកកាហ្វេ & ដូងធម្មជាតិ Coffee Body Scrub",
    category: "body",
    categoryName: "ថែរក្សាដងខ្លួន",
    priceUSD: 6.00,
    priceKHR: 24000,
    oldPriceUSD: 7.50,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    badge: "ពេញនិយម",
    rating: 4.9,
    reviews: 118,
    size: "350 g",
    inStock: true,
    description: "ស្ក្រាប់កាហ្វេអារ៉ាប៊ីកា លាយប្រេងដូងធម្មជាតិ ជួយជម្រុះកោសិកាស្បែកចាស់ៗ កម្ចាត់ស្នាមអុចខ្មៅតាមកែងដៃ ក្បាលជង្គង់ និងក្រលៀន។",
    benefits: [
      "ជម្រុះកោសិកាងាប់ ជួយឱ្យស្បែកភ្លឺថ្លា",
      "បំបាត់ស្បែកគ្រើម ឱ្យប្រែជាទន់រលោង",
      "កាត់បន្ថយស្នាមសង្វារ និងស្នាមអុចខ្មៅ",
      "ក្លិនកាហ្វេក្រអូបឈ្ងុយបន្ធូរអារម្មណ៍"
    ],
    usage: "ខាត់លើស្បែកសើម ២-៣ ដងក្នុងមួយសប្តាហ៍ រួចលាងទឹកចេញ។"
  },
  {
    id: "body-03",
    name: "ទឹកអប់ក្លិនផ្កាផ្អែមប្រណិត Luxury Flora Perfume Spray",
    category: "body",
    categoryName: "ថែរក្សាដងខ្លួន",
    priceUSD: 15.00,
    priceKHR: 60000,
    oldPriceUSD: 19.00,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    badge: "ទើបមកដល់",
    rating: 4.9,
    reviews: 82,
    size: "100 ml",
    inStock: true,
    description: "ទឹកអប់ក្លិនផ្កាព្រៃស្រទន់ បង្កប់នូវភាពទាក់ទាញ ថ្លៃថ្នូរ ក្លិនក្រអូបជាប់បានរហូតដល់ ២៤ ម៉ោង ពេញនិយមបំផុតសម្រាប់នារីៗ។",
    benefits: [
      "ក្លិនក្រអូបស្រាលស្រទន់ មិនឈួលក្បាល",
      "ជាប់ក្លិនបានយូរពេញមួយថ្ងៃ",
      "ដបប្រណិត ស្អាតស័ក្តិសមទុកប្រើ ឬជូនជាកាដូ"
    ],
    usage: "បាញ់លើកដៃ កញ្ចឹងក និងសម្លៀកបំពាក់។"
  },
  {
    id: "body-04",
    name: "សាប៊ូដុសខ្លួនក្លិនទឹកដោះគោពពុះម៉ត់ Milk & Honey Body Wash",
    category: "body",
    categoryName: "ថែរក្សាដងខ្លួន",
    priceUSD: 7.00,
    priceKHR: 28000,
    oldPriceUSD: 8.50,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    badge: "",
    rating: 4.8,
    reviews: 65,
    size: "500 ml",
    inStock: true,
    description: "សាប៊ូដុសខ្លួនទឹកដោះគោ និងទឹកឃ្មុំធម្មជាតិ ផ្តល់សំណើមខ្ពស់ ស្បែកទន់រលោងមិនស្ងួត ក្រអូបក្លិនទឹកដោះគោផ្អែមស្រទន់។",
    benefits: [
      "សម្អាតរាងកាយបានស្អាតល្អ",
      "ចិញ្ចឹមស្បែកឱ្យទន់ម៉ត់រលោង",
      "ក្លិនក្រអូបជាប់ស្បែកពេញមួយថ្ងៃ"
    ],
    usage: "ចាក់លើអេប៉ុងដុសខ្លួន ឬបាតដៃ បង្កើតពពុះ រួចដុសលើដងខ្លួន និងលាងចេញ។"
  }
];

// ព័ត៌មានហាង (Store Configuration)
const STORE_CONFIG = {
  shopName: "ស្រីល័ក្ខ គ្រឿងក្រអូប",
  slogan: "មានលក់គ្រឿងក្រអូបគ្រប់មុខតម្លៃសមរម្យ គុណភាពល្អ",
  phone: "0962364475",
  phoneDisplay: "096 236 4475",
  telegramUsername: "sreyleak_cosmetics", // កែសម្រួលតាម Telegram username ពិតប្រាកដប្រសិនបើមាន
  telegramDirectLink: "https://t.me/+855962364475",
  callLink: "tel:0962364475",
  currencySymbol: "$",
  exchangeRateKHR: 4000, // 1 USD = 4000 KHR
  deliveryFees: {
    phnompenh: 1.50,
    province: 2.50
  },
  abaPayLink: "https://link.payway.com.kh/ABAPAYRz567848B",
  bakongQR: {
    merchantName: "SREYLEAK COSMETICS",
    accountNumber: "0962364475",
    bank: "ABA PayWay / Bakong / Wing"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, STORE_CONFIG };
}

