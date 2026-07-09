import { User, BusinessProfile, Review } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

// ── Templates by business category ──────────────────────────────────────────

const FOOD_TEMPLATES = [
  { rating: 5, content: "The food at {name} is absolutely incredible! Every dish is packed with flavor and the portion sizes are very generous. Will definitely be coming back regularly.", ownerReply: "Thank you so much! We're thrilled you enjoyed the meal. See you again soon!" },
  { rating: 5, content: "Best place to eat near campus. {name} serves the freshest ingredients and the service is always with a smile. Highly recommend the rice and curry!", ownerReply: "That means a lot to us! Glad you love our food." },
  { rating: 4, content: "Really good food and affordable prices. {name} has become my go-to spot between lectures. The kottu is especially good." },
  { rating: 4, content: "Great atmosphere at {name} and the staff are very friendly. Food came out quickly and tasted delicious. Will visit again." },
  { rating: 4, content: "Consistently good quality at {name}. I've ordered multiple times and they never disappoint. Fair prices for students." },
  { rating: 3, content: "Decent food at {name} but sometimes the wait is long during peak hours. The taste is good when it's fresh though." },
  { rating: 3, content: "Average experience at {name}. Food was okay but nothing特别的. Might give it another try." },
  { rating: 3, content: "Reasonable prices at {name} but the portion sizes could be bigger. Good option in a pinch." },
  { rating: 2, content: "Not the best experience at {name}. My order was wrong and the food was a bit cold when it arrived. Hope they improve." },
  { rating: 1, content: "Very disappointed with {name}. The quality has gone down significantly and the hygiene could be much better." },
];

const BOARDING_TEMPLATES = [
  { rating: 5, content: "Absolutely love staying at {name}! The room is spacious, well-ventilated, and the WiFi is super fast. Walking distance to campus which is a huge plus.", ownerReply: "Thank you for the lovely review! We work hard to keep our residents comfortable." },
  { rating: 5, content: "Best boarding experience I've had. {name} offers clean rooms, friendly staff, and a peaceful environment perfect for studying. Highly recommend!", ownerReply: "So happy to hear you're enjoying your stay! Let us know if you need anything." },
  { rating: 4, content: "Great place to live as a student. {name} is well-maintained, the landlord is responsive to issues, and the location is very convenient." },
  { rating: 4, content: "I've been at {name} for three months now and it's been a great experience. Good community, clean facilities, and reasonable rent." },
  { rating: 4, content: "Very satisfied with {name}. The room came fully furnished as promised and the common areas are kept clean." },
  { rating: 3, content: "Decent accommodation at {name}. The room is okay but the walls are a bit thin so noise can be an issue sometimes." },
  { rating: 3, content: "Average boarding at {name}. Facilities are basic but functional. Good for the price you pay." },
  { rating: 3, content: "It's okay for a student budget. {name} could improve on maintenance response times but overall it's liveable." },
  { rating: 2, content: "Not great. {name} had some maintenance issues that took weeks to address. The room was also smaller than advertised." },
  { rating: 1, content: "Would not recommend {name}. Poor maintenance, unreliable WiFi, and the management is hard to reach when issues arise." },
];

const TUTORING_TEMPLATES = [
  { rating: 5, content: "The sessions at {name} were incredibly helpful! The tutor explained complex topics in a way that finally made sense. My grades improved significantly.", ownerReply: "Thank you! It was a pleasure teaching you. Keep up the great work!" },
  { rating: 5, content: "Best tutoring I've ever had. {name} is patient, knowledgeable, and tailors the lessons to your learning pace. Highly recommend to any struggling student.", ownerReply: "So glad to hear that! You worked hard and deserved the results." },
  { rating: 4, content: "Great tutoring experience at {name}. Clear explanations and plenty of practice material. Helped me prepare well for my exams." },
  { rating: 4, content: "I was struggling with the subject but {name} helped me understand the fundamentals. Very patient and thorough in their teaching approach." },
  { rating: 4, content: "Really effective sessions at {name}. They break down difficult concepts into manageable parts. Would recommend to classmates." },
  { rating: 3, content: "Decent tutoring at {name}. Helped with some topics but I wish we could have covered more ground in each session." },
  { rating: 3, content: "Average experience with {name}. The tutor knows the material but the teaching style didn't fully click with me." },
  { rating: 2, content: "Not quite what I expected from {name}. The sessions felt rushed and there wasn't enough practice material provided." },
];

const CREATIVE_TEMPLATES = [
  { rating: 5, content: "Amazing work from {name}! The quality and creativity exceeded my expectations. Very professional from start to finish. Will definitely book again.", ownerReply: "Thank you so much! It was a pleasure working on this project with you." },
  { rating: 5, content: "I'm absolutely thrilled with what {name} delivered. Incredible attention to detail and a true artistic touch. Highly recommend!", ownerReply: "So happy you loved it! Your feedback means the world to me." },
  { rating: 4, content: "Very impressed with {name}. The work was delivered on time and the quality was excellent. Great communication throughout the process." },
  { rating: 4, content: "Really happy with the service from {name}. Creative, professional, and very responsive to feedback. Will work with them again." },
  { rating: 4, content: "Solid work from {name}. They understood exactly what I wanted and delivered beautiful results. Fair pricing too." },
  { rating: 3, content: "Decent work from {name}. It turned out okay but there were a few revisions needed to get it right. Communicative though." },
  { rating: 3, content: "Average experience with {name}. The quality was acceptable but I've seen better work at similar price points." },
  { rating: 2, content: "Mixed feelings about {name}. The initial result wasn't what I asked for and revisions took longer than expected." },
];

const FITNESS_TEMPLATES = [
  { rating: 5, content: "The classes at {name} are fantastic! The instructor is incredibly motivating and creates a welcoming environment for all levels. I look forward to every session.", ownerReply: "Thank you! Your energy and dedication are what make the classes great. Keep showing up!" },
  { rating: 5, content: "Absolutely love {name}! I've seen amazing progress since I started. Great workout routines and a really supportive atmosphere.", ownerReply: "So proud of your progress! You're doing an amazing job." },
  { rating: 4, content: "Great classes at {name}. The instructor pushes you to do your best while ensuring proper form. Really enjoyed the experience." },
  { rating: 4, content: "I've tried a few places but {name} stands out. Well-structured sessions and a friendly community. Highly recommend giving it a try." },
  { rating: 4, content: "Really enjoying the sessions at {name}. Good variety in the workouts and the instructor pays attention to everyone's form." },
  { rating: 3, content: "Decent classes at {name}. Good workout but sometimes the class size is too large for individual attention." },
  { rating: 3, content: "Average experience at {name}. The sessions are okay but nothing particularly special compared to other places." },
  { rating: 2, content: "Not the best fit for me. {name} has good energy but I felt the instruction lacked detail on proper technique." },
];

const MUSIC_TEMPLATES = [
  { rating: 5, content: "Learning at {name} has been an absolute joy! The teacher is incredibly patient and makes every lesson fun and engaging. I've progressed more than I ever expected.", ownerReply: "Thank you! You're a wonderful student and it's been a delight teaching you. Keep practicing!" },
  { rating: 5, content: "I've been taking lessons at {name} for a few months and the improvement is incredible. Structured curriculum and a teacher who truly cares about your progress.", ownerReply: "So proud of your growth! You have natural talent and dedication." },
  { rating: 4, content: "Great lessons at {name}. Well-structured and the teacher adapts to your skill level. I look forward to each session." },
  { rating: 4, content: "Really pleased with {name}. The instructor is knowledgeable and makes learning music theory easy to understand. Good value for money." },
  { rating: 4, content: "Enjoying my time at {name} a lot. The teaching style is supportive and encouraging. Would recommend to anyone starting out." },
  { rating: 3, content: "Decent lessons at {name}. The teacher knows their stuff but I wish the sessions were a bit longer for the price." },
  { rating: 3, content: "Average experience with {name}. Good for beginners but more advanced students might find the pace slow." },
  { rating: 2, content: "Not what I expected from {name}. The lessons felt unstructured and I didn't see much progress after several sessions." },
];

const REPAIR_TEMPLATES = [
  { rating: 5, content: "Quick and reliable service at {name}! Fixed my device on the spot in under an hour. Fair pricing and the technician really knew what they were doing.", ownerReply: "Glad we could help! We pride ourselves on fast, quality repairs." },
  { rating: 5, content: "Best repair shop around. {name} diagnosed the issue immediately and had it fixed the same day. Excellent customer service too!", ownerReply: "Thank you for trusting us with your device! Happy it's working perfectly now." },
  { rating: 4, content: "Great service at {name}. They were upfront about the cost and the repair was completed on time. My device works like new." },
  { rating: 4, content: "Very happy with {name}. Professional, affordable, and they explained exactly what was wrong. Will come back for any future issues." },
  { rating: 4, content: "Reliable service from {name}. Dropped off my device in the morning and it was ready by evening. Good communication throughout." },
  { rating: 3, content: "Decent repair at {name}. Fixed the issue but it took a bit longer than quoted. The final price was reasonable though." },
  { rating: 3, content: "Average experience at {name}. The repair works but I'm not sure about the long-term quality. Time will tell." },
  { rating: 2, content: "Not great service from {name}. The repair was expensive and the same issue came back after two weeks." },
];

const GENERIC_SERVICE_TEMPLATES = [
  { rating: 5, content: "Very happy with {name}! They delivered exactly what was promised and the quality exceeded expectations. Professional and reliable.", ownerReply: "Thank you for the wonderful review! We truly appreciate your support." },
  { rating: 5, content: "Excellent service from {name}. From start to finish everything was smooth and professional. Highly recommend to anyone looking for quality work.", ownerReply: "So glad you had a great experience! Looking forward to working with you again." },
  { rating: 4, content: "Good experience with {name}. They were professional, responsive, and delivered on time. Fair pricing for the quality provided." },
  { rating: 4, content: "Satisfied with the service at {name}. They listened to my requirements and delivered accordingly. Would consider using them again." },
  { rating: 4, content: "Solid work from {name}. Good communication and the final result met my expectations. Reasonable turnaround time." },
  { rating: 3, content: "Decent service from {name}. It did the job but there's room for improvement in terms of attention to detail." },
  { rating: 3, content: "Average experience with {name}. Got what I paid for but nothing outstanding. Might try other options next time." },
  { rating: 2, content: "Not entirely satisfied with {name}. The service was okay but communication could have been much better throughout the process." },
  { rating: 1, content: "Disappointing experience with {name}. What was delivered didn't fully match what was promised. Hope they improve their quality control." },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const SERVICE_TYPE_MAP = [
  { keywords: ["tutor", "tutoring", "academic", "tuition", "class", "lesson", "education", "math", "english", "science"], pool: TUTORING_TEMPLATES },
  { keywords: ["photography", "art", "design", "henna", "graphic", "sketch", "painting"], pool: CREATIVE_TEMPLATES },
  { keywords: ["fitness", "yoga", "dance", "gym", "workout", "training", "wellness", "coaching"], pool: FITNESS_TEMPLATES },
  { keywords: ["music", "piano", "violin", "guitar", "vocal", "instrument"], pool: MUSIC_TEMPLATES },
  { keywords: ["repair", "fix", "phone", "computer", "bike", "it support", "maintenance"], pool: REPAIR_TEMPLATES },
];

function findServicePool(serviceType) {
  const lower = (serviceType || "").toLowerCase();
  for (const entry of SERVICE_TYPE_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.pool;
  }
  return GENERIC_SERVICE_TEMPLATES;
}

function findTemplatePool(category, serviceType) {
  if (category === "FOOD") return FOOD_TEMPLATES;
  if (category === "BOARDING") return BOARDING_TEMPLATES;
  return findServicePool(serviceType);
}

function pickReview(si, bi, category, serviceType, businessName) {
  const pool = findTemplatePool(category, serviceType);
  const idx = (si + bi) % pool.length;
  const tpl = pool[idx];

  const content = tpl.content.replace(/{name}/g, businessName);
  const ownerReply = tpl.ownerReply ? tpl.ownerReply.replace(/{name}/g, businessName) : null;

  return {
    rating: tpl.rating,
    content,
    ownerReply,
    isAnonymous: Math.random() < 0.1,
    helpfulCount: Math.floor(Math.random() * 15),
    notHelpfulCount: Math.floor(Math.random() * 3),
    isLikedByOwner: Boolean(ownerReply) || Math.random() < 0.3,
  };
}

// ── Main Controller ──────────────────────────────────────────────────────────

export const seedReviews = catchAsync(async (req, res) => {
  const students = await User.findAll({
    where: { role: "Student" },
    order: [["id", "ASC"]],
    attributes: ["id"],
  });

  const businesses = await User.findAll({
    where: { role: "Business" },
    order: [["id", "ASC"]],
    attributes: ["id", "name"],
    include: [
      {
        model: BusinessProfile,
        as: "businessProfile",
        attributes: ["category", "serviceType"],
      },
    ],
  });

  if (!students.length || !businesses.length) {
    return sendResponse(res, 400, false, "No students or businesses found. Run seed-users first.");
  }

  const halfStudents = Math.ceil(students.length / 2);
  const reviewers = students.slice(0, halfStudents);

  const byCategory = {};
  for (const b of businesses) {
    const cat = b.businessProfile?.category || "UNKNOWN";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(b);
  }
  const targets = [];
  for (const cat of Object.keys(byCategory)) {
    const half = Math.ceil(byCategory[cat].length / 2);
    targets.push(...byCategory[cat].slice(0, half));
  }

  let created = 0;
  let skipped = 0;
  const categoryBreakdown = { FOOD: 0, BOARDING: 0, SELF_EMPLOYED: 0, UNKNOWN: 0 };

  for (let si = 0; si < reviewers.length; si++) {
    for (let bi = 0; bi < targets.length; bi++) {
      const student = reviewers[si];
      const biz = targets[bi];
      const profile = biz.businessProfile || {};
      const category = profile.category || "UNKNOWN";
      const serviceType = profile.serviceType || "";

      const data = pickReview(si, bi, category, serviceType, biz.name);

      const [, isNew] = await Review.findOrCreate({
        where: { reviewerId: student.id, targetId: biz.id },
        defaults: {
          reviewerId: student.id,
          targetId: biz.id,
          rating: data.rating,
          content: data.content,
          isAnonymous: data.isAnonymous,
          helpfulCount: data.helpfulCount,
          notHelpfulCount: data.notHelpfulCount,
          ownerReply: data.ownerReply,
          isLikedByOwner: data.isLikedByOwner,
        },
      });

      if (isNew) {
        created++;
        if (categoryBreakdown[category] !== undefined) categoryBreakdown[category]++;
        else categoryBreakdown.UNKNOWN++;
      } else {
        skipped++;
      }
    }
  }

  return sendResponse(res, 201, true, "Reviews seeded successfully!", {
    created,
    skipped,
    total: created + skipped,
    reviewers: reviewers.length,
    targets: targets.length,
    categoryBreakdown,
  });
});
