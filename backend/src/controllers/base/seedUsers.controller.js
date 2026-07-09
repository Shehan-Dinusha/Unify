import bcrypt from "bcryptjs";
import {
  User,
  StudentProfile,
  BusinessProfile,
  ClubProfile,
  Wallet,
  University,
  Faculty,
  Degree,
  Batch,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

// ── Helpers ──────────────────────────────────────────────────────────────────

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDigits(length) {
  return Array.from({ length }, () => randomInt(0, 9)).join("");
}

function randomLetter() {
  return String.fromCharCode(65 + randomInt(0, 25));
}

const PHONE_PREFIXES = ["70", "71", "72", "75", "76", "77", "78"];
const generatedPhones = new Set();

function sriLankanMobile() {
  let phone;
  do {
    const prefix = PHONE_PREFIXES[randomInt(0, PHONE_PREFIXES.length - 1)];
    const part1 = String(100 + randomInt(0, 899));
    const part2 = String(10000 + randomInt(0, 8999)).slice(1);
    phone = `+94 ${prefix} ${part1} ${part2}`;
  } while (generatedPhones.has(phone));
  generatedPhones.add(phone);
  return phone;
}

function generateRegNumber(batchName, degreeIndex) {
  const batchCode = batchName.replace("Batch ", "");
  const degCode =
    degreeIndex <= 9
      ? String(degreeIndex)
      : String.fromCharCode(65 + degreeIndex - 10);
  return `${batchCode}${degCode}${randomDigits(3)}${randomLetter()}`;
}

const SERVICE_TYPES = {
  FOOD: [
    "Restaurant & Dining",
    "Cafe & Coffee Shop",
    "Fast Food",
    "Bakery & Desserts",
    "Street Food",
    "Family Restaurant",
    "Takeaway",
  ],
  BOARDING: [
    "Student Accommodation",
    "Boarding House",
    "Shared Hostel",
    "Private Room",
    "PG Accommodation",
  ],
  SELF_EMPLOYED: [
    "Tutoring",
    "Photography",
    "Fitness Training",
    "Art & Design",
    "Music Lessons",
    "Repair Service",
    "Consulting",
  ],
};

function serviceType(category, index) {
  const types = SERVICE_TYPES[category];
  return types[index % types.length];
}

function nic() {
  return Math.random() > 0.5
    ? `${randomDigits(9)}V`
    : `${randomInt(1990, 2005)}${randomDigits(8)}`;
}

const SRI_LANKAN_CITIES = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Kurunegala",
  "Negombo",
  "Moratuwa",
  "Anuradhapura",
  "Ratnapura",
  "Badulla",
];

function studentAddress() {
  const city = SRI_LANKAN_CITIES[randomInt(0, SRI_LANKAN_CITIES.length - 1)];
  const streets = ["Main Street", "Galle Road", "Temple Road", "Station Road", "Lake Road"];
  return [
    {
      street: `${randomInt(1, 300)} ${streets[randomInt(0, 4)]}`,
      city,
      postalCode: `${randomInt(10000, 99999)}`,
    },
  ];
}

function joinDate(batchName) {
  return new Date(2000 + parseInt(batchName.slice(-2)), 0, 1);
}

// ── Name pools ───────────────────────────────────────────────────────────────

const MALE_FIRST = [
  "Kamal",
  "Nimal",
  "Sunil",
  "Thusitha",
  "Chaminda",
  "Rohan",
  "Asela",
  "Nuwan",
  "Dilan",
  "Lasitha",
  "Indika",
  "Chathura",
  "Madhawa",
  "Isuru",
  "Pabasara",
  "Hasitha",
  "Samudra",
  "Bimsara",
  "Yasas",
  "Duminda",
  "Sampath",
  "Tharindu",
  "Ravindu",
  "Harsha",
  "Lakmal",
  "Anuradha",
  "Gayan",
  "Janaka",
  "Shanaka",
  "Buddhika",
];

const FEMALE_FIRST = [
  "Priyanka",
  "Dilani",
  "Sachini",
  "Tharushi",
  "Nadeesha",
  "Nisansala",
  "Madushi",
  "Kavindi",
  "Ishani",
  "Sanduni",
  "Oshini",
  "Lakshani",
  "Nethmi",
  "Dharani",
  "Vihara",
  "Thisari",
  "Ruvini",
  "Chethana",
  "Nadeeka",
  "Sashini",
  "Thilinika",
  "Anushka",
  "Hashini",
  "Dilini",
  "Pamoda",
  "Sewwandi",
  "Imesha",
  "Maneesha",
  "Sajini",
  "Senuri",
];

const LAST_NAMES = [
  "Perera",
  "Silva",
  "Fernando",
  "Bandara",
  "Jayawardena",
  "Kumara",
  "Wickramasinghe",
  "Weerasinghe",
  "Herath",
  "Ranasinghe",
  "Gunasekara",
  "Samarasekara",
  "Munasinghe",
  "Jayasinghe",
  "De Silva",
  "Amarasinghe",
  "Dissanayake",
  "Ekanayake",
  "Karunaratne",
  "Senanayake",
  "Rathnayake",
  "Wijesinghe",
  "Pathirana",
  "Liyanage",
  "Abeysekara",
  "Alwis",
  "Ariyaratne",
  "Atapattu",
  "Gunawardena",
  "Jayasuriya",
];

// ── Business / Club data ─────────────────────────────────────────────────────

const CLUBS = [
  {
    name: "Leo Club of University of Moratuwa",
    about:
      "Empowering students through leadership, experience, and opportunity as part of the global Leo movement.",
  },
  {
    name: "IEEE Student Branch of UoM",
    about:
      "Advancing technology and innovation through workshops, hackathons, and technical publications.",
  },
  {
    name: "Rotaract Club of UoM",
    about:
      "Service above self — community development and professional growth through Rotaract.",
  },
  {
    name: "AIESEC in University of Moratuwa",
    about:
      "Developing young leaders through international internships and exchange programs.",
  },
  {
    name: "Mora Robotics and Automation Society",
    about:
      "Building the future of automation through robotics competitions and research projects.",
  },
  {
    name: "Debating and Public Speaking Society",
    about:
      "Sharpening critical thinking and oratory skills through weekly debates.",
  },
  {
    name: "Photography Society of UoM",
    about:
      "Capturing moments that matter — from campus life to professional exhibitions.",
  },
  {
    name: "Drama Society of UoM",
    about:
      "Bringing stories to life through theatrical productions and stage performances.",
  },
  {
    name: "Music Circle of UoM",
    about:
      "A community for musicians — from classical ensembles to modern bands.",
  },
  {
    name: "Green Society of UoM",
    about:
      "Promoting environmental sustainability through tree planting and awareness campaigns.",
  },
  {
    name: "English Literary Association",
    about:
      "Exploring English literature through poetry, prose, and literary discussions.",
  },
  {
    name: "Science and Innovation Forum",
    about: "Fostering scientific curiosity through lectures and lab visits.",
  },
  {
    name: "Hindu Students' Society",
    about: "Preserving and celebrating Hindu culture and traditions on campus.",
  },
  {
    name: "Catholic Students' Society",
    about: "Nurturing faith and fellowship among Catholic students at UoM.",
  },
  {
    name: "Muslim Majlis of UoM",
    about:
      "A platform for Muslim students to gather, learn, and engage in community service.",
  },
  {
    name: "Buddhist Society of UoM",
    about:
      "Promoting Buddhist philosophy, meditation, and cultural events on campus.",
  },
  {
    name: "Astronomy and Space Enthusiasts",
    about: "Exploring the cosmos through stargazing sessions and space talks.",
  },
  {
    name: "Entrepreneurship and Innovation Club",
    about:
      "Empowering student entrepreneurs with mentorship and startup resources.",
  },
  {
    name: "Sports Council of UoM",
    about:
      "Organizing inter-faculty and inter-university sports tournaments and fitness events.",
  },
  {
    name: "Media and Publications Society",
    about:
      "Campus journalism, magazine publishing, and digital media content creation.",
  },
];

const FOOD = [
  {
    name: "Paradise Inn Family Restaurant",
    desc: "Family-friendly restaurant serving authentic Sri Lankan rice and curry, string hoppers, and kottu.",
  },
  {
    name: "Mora Bites Fast Food",
    desc: "Quick and affordable burgers, fries, and wraps popular among students between lectures.",
  },
  {
    name: "Spicy Kitchen",
    desc: "Known for spicy chicken dishes, devilled prawns, and sizzling plates near Katubedda junction.",
  },
  {
    name: "Green Chill Cafe",
    desc: "Cozy cafe serving fresh juices, smoothies, sandwiches, and salads for health-conscious students.",
  },
  {
    name: "Curry Pot",
    desc: "Homestyle Sri Lankan curries with rice, paratha, and string hoppers — a taste of home.",
  },
  {
    name: "Harbour Court Restaurant",
    desc: "Casual dining with a mix of Sri Lankan, Chinese, and Western dishes at student-friendly prices.",
  },
  {
    name: "The Lunch Factory",
    desc: "Affordable lunch packets and short eats delivered to campus buildings daily.",
  },
  {
    name: "Pizza Stop Moratuwa",
    desc: "Freshly baked pizzas with a variety of toppings and combo deals for groups.",
  },
  {
    name: "Kottu King",
    desc: "Specializing in kottu roti with chicken, cheese, egg, and seafood variations.",
  },
  {
    name: "Rice & Spice",
    desc: "Traditional rice and curry with a different menu every day of the week.",
  },
  {
    name: "Ocean Breeze Cafe",
    desc: "Seafood specialties and cool beverages with a relaxed seaside vibe.",
  },
  {
    name: "The Sandwich Shop",
    desc: "Gourmet sandwiches, wraps, and salads made fresh to order.",
  },
  {
    name: "Sakura Japanese Kitchen",
    desc: "Affordable sushi rolls, ramen bowls, and teriyaki dishes for Japanese food lovers.",
  },
  {
    name: "Dosa Plaza",
    desc: "Authentic South Indian dosa, idli, vada, and sambar near the university gate.",
  },
  {
    name: "Wok Express",
    desc: "Stir-fry noodles, fried rice, and Chinese specialties ready in minutes.",
  },
  {
    name: "Burger Point",
    desc: "Juicy beef, chicken, and veggie burgers with loaded fries and milkshakes.",
  },
  {
    name: "Noodle House",
    desc: "Asian noodle bowls, ramen, and pho served hot and fresh.",
  },
  {
    name: "Cafe Mocha",
    desc: "Specialty coffee, iced lattes, pastries, and Wi-Fi for study sessions.",
  },
  {
    name: "Street Food Hub",
    desc: "Sri Lankan street food favorites — isso vade, kottu, samosa, and parippu vade.",
  },
  {
    name: "Bakes & Treats",
    desc: "Freshly baked cakes, pastries, cookies, and desserts for a sweet craving.",
  },
];

const BOARDING = [
  {
    name: "Cozy Student Boarding",
    desc: "Comfortable single and shared rooms with Wi-Fi, meals, and study areas for students.",
  },
  {
    name: "Sunshine Boarding House",
    desc: "Bright and airy rooms with attached bathrooms, kitchen access, and laundry service.",
  },
  {
    name: "Royal Student Accommodation",
    desc: "Premium boarding with air-conditioned rooms, gym, and common lounge.",
  },
  {
    name: "Home Away Boarding",
    desc: "Affordable boarding with a family atmosphere and home-cooked meals included.",
  },
  {
    name: "Comfort Living Boarding",
    desc: "Modern boarding with 24/7 security, CCTV, and high-speed internet.",
  },
  {
    name: "Green View Boarding",
    desc: "Peaceful boarding surrounded by greenery, ideal for focused study.",
  },
  {
    name: "City Rest Boarding",
    desc: "Conveniently located boarding close to the university with easy transport access.",
  },
  {
    name: "Crown Boarding House",
    desc: "Well-maintained boarding with furnished rooms and common dining facilities.",
  },
  {
    name: "Student Nest Boarding",
    desc: "Purpose-built student accommodation with study desks, beds, and storage.",
  },
  {
    name: "Lake View Residence",
    desc: "Scenic boarding with lake views, garden, and outdoor study spaces.",
  },
  {
    name: "Silver Home Boarding",
    desc: "Budget-friendly boarding for female students with a safe and secure environment.",
  },
  {
    name: "Golden Nest Boarding",
    desc: "Spacious rooms with attached bathrooms, pantry access, and recreational area.",
  },
  {
    name: "Sapphire Boarding House",
    desc: "Clean and tidy boarding with regular housekeeping and meal plans available.",
  },
  {
    name: "Elite Student Living",
    desc: "Upscale student accommodation with modern furnishings and ensuite bathrooms.",
  },
  {
    name: "Metro Boarding",
    desc: "Urban boarding with easy access to public transport and shopping areas.",
  },
  {
    name: "Campus Nest Boarding",
    desc: "Just minutes from campus — ideal for students who want to walk to class.",
  },
  {
    name: "Blue Ocean Boarding",
    desc: "Beachside boarding offering a relaxing environment after a long day of classes.",
  },
  {
    name: "Kings Court Boarding",
    desc: "Secure boarding with keycard access, lockers, and study rooms.",
  },
  {
    name: "Harmony Boarding House",
    desc: "Quiet and peaceful boarding suitable for postgraduate and research students.",
  },
  {
    name: "Prime Student Stay",
    desc: "All-inclusive boarding with Wi-Fi, meals, utilities, and weekly housekeeping.",
  },
];

const SELF_EMPLOYED = [
  {
    name: "Priya's Math Tutoring",
    desc: "Expert mathematics tutoring for A/L and university-level engineering mathematics.",
  },
  {
    name: "Chaminda's Photography",
    desc: "Professional photography services for events, portraits, and product shoots.",
  },
  {
    name: "Nimal's Yoga Studio",
    desc: "Certified yoga and meditation classes for stress relief and flexibility.",
  },
  {
    name: "Kumari's Art Classes",
    desc: "Watercolor, acrylic, and sketching classes for beginners and advanced artists.",
  },
  {
    name: "Thusitha's Guitar Lessons",
    desc: "Learn acoustic and electric guitar from basics to advanced techniques.",
  },
  {
    name: "Sachini's Dance Academy",
    desc: "Traditional and contemporary dance classes for all ages and skill levels.",
  },
  {
    name: "Rohan's Web Design Studio",
    desc: "Custom website design and development for small businesses and startups.",
  },
  {
    name: "Dilani's English Tuition",
    desc: "English language coaching for IELTS, TOEFL, and general communication skills.",
  },
  {
    name: "Nuwan's Phone Repairs",
    desc: "Fast and reliable smartphone repair services including screen and battery replacement.",
  },
  {
    name: "Tharushi's Baking Studio",
    desc: "Custom cakes, cupcakes, and pastries for birthdays, events, and celebrations.",
  },
  {
    name: "Asela's Personal Fitness",
    desc: "Personal training and fitness coaching with customized workout plans.",
  },
  {
    name: "Sashini's Henna Art",
    desc: "Beautiful bridal and event henna designs with natural, safe ingredients.",
  },
  {
    name: "Samudra's Graphic Design",
    desc: "Logo design, branding, and social media graphics for businesses and clubs.",
  },
  {
    name: "Pabasara's Academic Tutoring",
    desc: "Science and mathematics tutoring for school and university students.",
  },
  {
    name: "Nisansala's Sewing Studio",
    desc: "Custom tailoring, alterations, and traditional dress design services.",
  },
  {
    name: "Madhawa's IT Support",
    desc: "Computer repair, virus removal, and IT setup services for students and faculty.",
  },
  {
    name: "Nethmi's Music School",
    desc: "Piano, violin, and vocal training with graded examination preparation.",
  },
  {
    name: "Indika's Bike Repairs",
    desc: "Bicycle repair and maintenance services including tune-ups and custom builds.",
  },
  {
    name: "Ishani's Wellness Coaching",
    desc: "Holistic wellness coaching including nutrition, mindfulness, and lifestyle guidance.",
  },
  {
    name: "Chathura's Tutoring Centre",
    desc: "Physics and chemistry tutoring with lab demonstrations and problem-solving sessions.",
  },
];

// ── Main Controller ─────────────────────────────────────────────────────────

export const seedUsers = async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash("Password@123", 10);

    // ── Fetch academic structure ────────────────────────────────────────────
    const university = await University.findOne({
      where: { name: "University of Moratuwa" },
    });
    if (!university) {
      return sendResponse(
        res,
        400,
        false,
        "Academic structure not found. Run `npm run seed` first.",
      );
    }

    const faculties = await Faculty.findAll({
      where: { universityId: university.id },
    });
    const allBatches = await Batch.findAll({ order: [["id", "ASC"]] });

    const facMap = {};
    for (const f of faculties) {
      const degrees = await Degree.findAll({
        where: { facultyId: f.id },
        order: [["id", "ASC"]],
      });
      facMap[f.name] = { id: f.id, degrees };
    }

    const findUser = async (email, phone) => {
      const where = { [Op.or]: [] };
      if (email) where[Op.or].push({ email });
      if (phone) where[Op.or].push({ phone });
      if (where[Op.or].length === 0) return null;
      return await User.findOne({ where });
    }

    const results = { created: 0, skipped: 0, errors: 0 };

    // ── Seed Students ───────────────────────────────────────────────────────
    const studentPlan = [
      {
        faculty: "Architecture",
        degrees: [
          "BArch (Hons)",
          "BArch (Hons)",
          "BArch (Hons)",
          "BLA (Hons)",
          "BLA (Hons)",
          "BDes (Hons)",
          "BDes (Hons)",
          "BSc (Hons) in Quantity Surveying",
          "BSc (Hons) in Quantity Surveying",
        ],
      },
      {
        faculty: "Engineering",
        degrees: [
          "BSc Eng (Hons) in Computer Science & Engineering",
          "BSc Eng (Hons) in Computer Science & Engineering",
          "BSc Eng (Hons) in Computer Science & Engineering",
          "BSc Eng (Hons) in Civil Engineering",
          "BSc Eng (Hons) in Civil Engineering",
          "BSc Eng (Hons) in Mechanical Engineering",
          "BSc Eng (Hons) in Mechanical Engineering",
          "BSc Eng (Hons) in Electrical Engineering",
          "BSc Eng (Hons) in Electrical Engineering",
          "BSc Eng (Hons) in Electronic & Telecommunication Engineering",
          "BSc Eng (Hons) in Electronic & Telecommunication Engineering",
          "BSc Eng (Hons) in Chemical & Process Engineering",
          "BSc Eng (Hons) in Earth Resource Engineering",
          "BSc Eng (Hons) in Materials Science & Engineering",
          "BSc Eng (Hons) in Textile & Apparel Engineering",
        ],
      },
      {
        faculty: "Information Technology",
        degrees: [
          "BSc (Hons) in Information Technology",
          "BSc (Hons) in Information Technology",
          "BSc (Hons) in Information Technology",
          "BSc (Hons) in Information Technology",
          "BSc (Hons) in Information Technology & Management",
          "BSc (Hons) in Information Technology & Management",
          "BSc (Hons) in Information Technology & Management",
          "BSc (Hons) in Artificial Intelligence",
          "BSc (Hons) in Artificial Intelligence",
          "BSc (Hons) in Artificial Intelligence",
        ],
      },
      { faculty: "Business", degrees: Array(8).fill("BBSc (Hons)") },
      { faculty: "Medicine", degrees: Array(8).fill("BSc (Hons) in Medicine") },
    ];

    let nameIdx = 0;
    for (const group of studentPlan) {
      const fac = facMap[group.faculty];
      if (!fac) {
        logger.warn(`Faculty "${group.faculty}" not found in DB`);
        continue;
      }

      const batchPool = allBatches.slice(0, 5);
      for (const degreeName of group.degrees) {
        const degIndex = fac.degrees.findIndex((d) => d.name === degreeName);
        if (degIndex === -1) {
          logger.warn(`Degree "${degreeName}" not found`);
          results.errors++;
          continue;
        }
        const degree = fac.degrees[degIndex];

        const isMale = nameIdx % 2 === 0;
        const firstPool = isMale ? MALE_FIRST : FEMALE_FIRST;
        const firstName = firstPool[nameIdx % firstPool.length];
        const lastName = LAST_NAMES[nameIdx % LAST_NAMES.length];
        nameIdx++;

        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@uom.lk`;
        const phone = sriLankanMobile();
        const batch = batchPool[randomInt(0, batchPool.length - 1)];
        const regNumber = generateRegNumber(batch.name, degIndex + 1);

        const existing = await findUser(email, null);
        if (existing) {
          results.skipped++;
          continue;
        }

        try {
          const user = await User.create({
            name: fullName,
            email,
            passwordHash,
            role: "Student",
            isVerified: true,
            status: "Active",
          });

          await StudentProfile.create({
            userId: user.id,
            universityId: university.id,
            facultyId: fac.id,
            degreeId: degree.id,
            batchId: batch.id,
            registrationNumber: regNumber,
            isBatchRep: false,
            firstName,
            lastName,
            gender: isMale ? "Male" : "Female",
            dateOfBirth: new Date(
              randomInt(1998, 2004),
              randomInt(0, 11),
              randomInt(1, 28),
            ),
            addresses: studentAddress(),
            joinDate: joinDate(batch.name),
          });

          results.created++;
        } catch (err) {
          logger.error(`Failed to create student ${email}: ${err.message}`);
          results.errors++;
        }
      }
    }

    // ── Seed Clubs ──────────────────────────────────────────────────────────
    for (const club of CLUBS) {
      const slug = club.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
      const hasEmail = Math.random() < 0.5;
      const email = hasEmail ? `${slug}@uom.lk` : null;
      const phone = hasEmail ? null : sriLankanMobile();

      const existing = await findUser(email, phone);
      if (existing) {
        results.skipped++;
        continue;
      }

      try {
        const user = await User.create({
          name: club.name,
          email,
          phone,
          passwordHash,
          role: "Club",
          isVerified: true,
          status: "Active",
        });

        await ClubProfile.create({
          userId: user.id,
          clubName: club.name,
          about: club.about,
          email,
          isVerified: false,
        });

        await Wallet.create({ userId: user.id, currency: "LKR" });
        results.created++;
      } catch (err) {
        logger.error(`Failed to create club ${club.name}: ${err.message}`);
        results.errors++;
      }
    }

    // ── Seed Business: Food ──────────────────────────────────────────────────
    let bizIdx = 0;
    for (const b of FOOD) {
      const hasEmail = Math.random() < 0.5;
      const email = hasEmail ? `${b.name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@gmail.com` : null;
      const phone = hasEmail ? null : sriLankanMobile();
      const isMaleOwner = bizIdx % 2 === 0;
      const ownerFirst = isMaleOwner
        ? MALE_FIRST[bizIdx % MALE_FIRST.length]
        : FEMALE_FIRST[bizIdx % FEMALE_FIRST.length];
      const ownerLast = LAST_NAMES[bizIdx % LAST_NAMES.length];

      const existing = await findUser(email, phone);
      if (existing) {
        results.skipped++;
        bizIdx++;
        continue;
      }

      try {
        const user = await User.create({
          name: b.name,
          email,
          phone,
          passwordHash,
          role: "Business",
          isVerified: true,
          status: "Active",
        });

        await BusinessProfile.create({
          userId: user.id,
          displayName: b.name,
          businessName: b.name,
          category: "FOOD",
          about: b.desc,
          email,
          phone,
          addresses: [
            {
              street: "Katubedda, Moratuwa, Sri Lanka",
              city: "Moratuwa",
              postalCode: "10400",
            },
          ],
          serviceType: serviceType("FOOD", bizIdx),
          ownerFirstName: ownerFirst,
          ownerLastName: ownerLast,
          nic: nic(),
          dob: new Date(
            randomInt(1970, 1995),
            randomInt(0, 11),
            randomInt(1, 28),
          ),
          gender: isMaleOwner ? "Male" : "Female",
        });

        await Wallet.create({ userId: user.id, currency: "LKR" });
        results.created++;
      } catch (err) {
        logger.error(
          `Failed to create food business ${b.name}: ${err.message}`,
        );
        results.errors++;
      }
      bizIdx++;
    }

    // ── Seed Business: Boarding ──────────────────────────────────────────────
    bizIdx = 0;
    for (const b of BOARDING) {
      const hasEmail = Math.random() < 0.5;
      const email = hasEmail ? `${b.name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@gmail.com` : null;
      const phone = hasEmail ? null : sriLankanMobile();
      const isMaleOwner = bizIdx % 2 === 0;
      const ownerFirst = isMaleOwner
        ? MALE_FIRST[bizIdx % MALE_FIRST.length]
        : FEMALE_FIRST[bizIdx % FEMALE_FIRST.length];
      const ownerLast = LAST_NAMES[bizIdx % LAST_NAMES.length];

      const existing = await findUser(email, phone);
      if (existing) {
        results.skipped++;
        bizIdx++;
        continue;
      }

      try {
        const user = await User.create({
          name: b.name,
          email,
          phone,
          passwordHash,
          role: "Business",
          isVerified: true,
          status: "Active",
        });

        await BusinessProfile.create({
          userId: user.id,
          displayName: b.name,
          businessName: b.name,
          category: "BOARDING",
          about: b.desc,
          email,
          phone,
          addresses: [
            {
              street: "Katubedda, Moratuwa, Sri Lanka",
              city: "Moratuwa",
              postalCode: "10400",
            },
          ],
          serviceType: serviceType("BOARDING", bizIdx),
          ownerFirstName: ownerFirst,
          ownerLastName: ownerLast,
          nic: nic(),
          dob: new Date(
            randomInt(1970, 1995),
            randomInt(0, 11),
            randomInt(1, 28),
          ),
          gender: isMaleOwner ? "Male" : "Female",
        });

        await Wallet.create({ userId: user.id, currency: "LKR" });
        results.created++;
      } catch (err) {
        logger.error(`Failed to create boarding ${b.name}: ${err.message}`);
        results.errors++;
      }
      bizIdx++;
    }

    // ── Seed Business: Self-Employed ─────────────────────────────────────────
    bizIdx = 0;
    for (const b of SELF_EMPLOYED) {
      const hasEmail = Math.random() < 0.5;
      const email = hasEmail ? `${b.name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@gmail.com` : null;
      const phone = hasEmail ? null : sriLankanMobile();
      const isMaleOwner = bizIdx % 2 === 0;
      const ownerFirst = isMaleOwner
        ? MALE_FIRST[bizIdx % MALE_FIRST.length]
        : FEMALE_FIRST[bizIdx % FEMALE_FIRST.length];
      const ownerLast = LAST_NAMES[bizIdx % LAST_NAMES.length];

      const existing = await findUser(email, phone);
      if (existing) {
        results.skipped++;
        bizIdx++;
        continue;
      }

      try {
        const user = await User.create({
          name: b.name,
          email,
          phone,
          passwordHash,
          role: "Business",
          isVerified: true,
          status: "Active",
        });

        await BusinessProfile.create({
          userId: user.id,
          displayName: b.name,
          businessName: b.name,
          category: "SELF_EMPLOYED",
          about: b.desc,
          email,
          phone,
          addresses: [
            {
              street: "Moratuwa, Sri Lanka",
              city: "Moratuwa",
              postalCode: "10400",
            },
          ],
          serviceType: serviceType("SELF_EMPLOYED", bizIdx),
          ownerFirstName: ownerFirst,
          ownerLastName: ownerLast,
          nic: nic(),
          dob: new Date(
            randomInt(1970, 1995),
            randomInt(0, 11),
            randomInt(1, 28),
          ),
          gender: isMaleOwner ? "Male" : "Female",
        });

        await Wallet.create({ userId: user.id, currency: "LKR" });
        results.created++;
      } catch (err) {
        logger.error(
          `Failed to create self-employed ${b.name}: ${err.message}`,
        );
        results.errors++;
      }
      bizIdx++;
    }

    logger.info(
      `🎉 Seed users complete — created: ${results.created}, skipped: ${results.skipped}, errors: ${results.errors}`,
    );
    return sendResponse(res, 200, true, "Users seeded successfully", results);
  } catch (error) {
    logger.error("❌ Seed users error:", error);
    return sendResponse(res, 500, false, "Failed to seed users", error.message);
  }
};
