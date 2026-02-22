export const mockTrendingNow = [
    { id: "t1", title: "Art Society Prints", subtitle: "Selling fast • $8", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=200&q=80" },
    { id: "t2", title: "Winter Beanies", subtitle: "New Arrival • $12", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=200&q=80" },
    { id: "t3", title: "Neon Night Party", subtitle: "350 going", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80" },
];

export const mockClubFeed = [
    {
        id: "c1",
        clubName: "Photography Society",
        clubSeed: "Photography Society",
        time: "2h ago",
        category: "Merchandise",
        price: "Rs.15.00",
        image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1400&q=80",
        text:
            "Introducing our limited edition leather camera straps. Hand-stitched and durable for all your field trips. Get yours before they run out! 📸",
        stats: { likes: 124, comments: 10 },
        comments: [
            { id: "cm1", user: "Alex Carter", seed: "AlexCarter", time: "1h ago", text: "These straps look absolutely gorgeous! Just ordered one 🙌" },
            { id: "cm2", user: "Maya Singh", seed: "MayaSingh", time: "2h ago", text: "Been waiting for this drop. The leather quality on the last batch was top notch." },
            { id: "cm3", user: "Jordan Lee", seed: "JordanLee", time: "2h ago", text: "Do these fit full-frame DSLRs? Asking for a friend 😄" },
            { id: "cm4", user: "Priya Nair", seed: "PriyaNair", time: "3h ago", text: "Love supporting student-made merch. Copped two already!" },
        ],
    },
    {
        id: "c2",
        clubName: "Coding Club",
        clubSeed: "Coding Club",
        time: "6h ago",
        category: "Merchandise",
        /*price: "$20.00",*/
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
        text:
            "Hackathon hoodie pre-orders are open. Premium fabric + embroidered logo. Sizes limited!",
        stats: { likes: 86, comments: 4 },
        comments: [
            { id: "cm5", user: "Sam Rivera", seed: "SamRivera", time: "4h ago", text: "Front-end or back-end hoodie? Asking the real questions 😂" },
            { id: "cm6", user: "Chris Han", seed: "ChrisHan", time: "5h ago", text: "The embroidered logo looks clean. Definitely copping a medium." },
            { id: "cm7", user: "Nina Patel", seed: "NinaPatel", time: "6h ago", text: "When's the deadline for pre-orders? Don't want to miss it!" },
            { id: "cm8", user: "Dev Kumar", seed: "DevKumar", time: "6h ago", text: "Already pre-ordered mine. Can't wait for hackathon season 🚀" },
        ],
    },
    {
        id: "c3",
        clubName: "Art Society",
        clubSeed: "Art Society",
        time: "1d ago",
        category: "Prints",
        price: "Rs.8.00",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1400&q=80",
        text:
            "New prints drop! Support student artists. Limited stock.",
        stats: { likes: 59, comments: 2 },
        comments: [
            { id: "cm9", user: "Lena Moore", seed: "LenaMoore", time: "20h ago", text: "The colors are so vibrant! Is the A3 size still available?" },
            { id: "cm10", user: "Raj Mehta", seed: "RajMehta", time: "22h ago", text: "Supporting student artists is truly beautiful. Picked up two! 🎨" },
        ],
    },
];
