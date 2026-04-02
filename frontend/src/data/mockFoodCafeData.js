// src/data/mockFoodCafeData.js

export const mockFoodCafePosts = [
    {
        id: "fc-1",
        user: "Millenium",
        userSeed: "Millenium",
        time: "5h ago",
        description: "Perfect for grad students. Quiet, private entrance, kitchenette included.",
        images: [
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        ],
        stats: {
            likes: 124,
            comments: 10,
        },
        comments: [
            { id: "c1", user: "Sam R.", seed: "Sam R", time: "2h ago", text: "Is this place open on weekends?" },
            { id: "c2", user: "Jane D.", seed: "Jane D.", time: "1h ago", text: "Yes, 8 AM to 8 PM!" },
        ],
    },
    {
        id: "fc-2",
        user: "The Coffee House",
        userSeed: "The Coffee House",
        time: "1d ago",

        description: "Best espresso on campus. Great atmosphere for studying and meeting friends. Free Wi-Fi included.",
        images: [
            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1442115994350-b1bb36349c2e?auto=format&fit=crop&w=1200&q=80",
        ],
        stats: {
            likes: 89,
            comments: 4,
        },
        comments: [],
    },
];
