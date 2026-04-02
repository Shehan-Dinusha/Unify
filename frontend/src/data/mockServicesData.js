// src/data/mockServicesData.js

export const mockServicesPosts = [
    {
        id: "s-1",
        user: "Bike Rental",
        userSeed: "Bike Rental",
        time: "5h ago",
        description: "Perfect for grad students. Quiet, private entrance, kitchenette included.",
        images: [
            "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1471440671318-55bdbb772f93?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=1200&q=80",
        ],
        stats: {
            likes: 124,
            comments: 10,
        },
        comments: [
            { id: "c1", user: "Sam R.", seed: "Sam R", time: "2h ago", text: "Is this place open on weekends?" },
        ],
    },
    {
        id: "s-2",
        user: "Laundry Pro",
        userSeed: "Laundry Pro",
        time: "1d ago",
        description: "Quick and clean laundry services. We handle delicate fabrics with care. Free pickup and delivery for students.",
        images: [
            "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1521656693084-38385ebfb350?auto=format&fit=crop&w=1200&q=80",
        ],
        stats: {
            likes: 45,
            comments: 2,
        },
        comments: [],
    },
    {
        id: "s-3",
        user: "Tech Fix",
        userSeed: "Tech Fix",
        time: "2d ago",
        description: "Laptop and phone repairs at affordable prices. Cracked screen? We can fix it in under 2 hours.",
        images: [
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1597740985671-2a8a3b80ec02?auto=format&fit=crop&w=1200&q=80",
        ],
        stats: {
            likes: 210,
            comments: 15,
        },
        comments: [],
    },
];
