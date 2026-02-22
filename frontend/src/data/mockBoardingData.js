export const mockBoardingFeed = [
    {
        id: "b1",
        user: "Jane D.",
        userSeed: "JaneD",
        time: "5h ago",
        title: "Studio near Library",
        location: "0.2 km from Central Library",
        description:
            "Perfect for grad students. Quiet, private entrance, kitchenette included.",
        price: "Rs.450/month",
        gender: "Female Only",
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80",
        ],
        stats: { likes: 124, comments: 10 },
        comments: [
            { id: "bc1", user: "Riya Sharma", seed: "RiyaSharma", time: "3h ago", text: "Is the room still available? I'm interested!" },
            { id: "bc2", user: "Sara Mills", seed: "SaraMills", time: "4h ago", text: "Love the location, so close to the library 📚" },
            { id: "bc3", user: "Ava Chen", seed: "AvaChen", time: "5h ago", text: "Does it include utilities in the price?" },
        ],
    },
    {
        id: "b2",
        user: "Kamal P.",
        userSeed: "KamalP",
        time: "1d ago",
        title: "Cozy Room in Shared House",
        location: "0.5 km from Engineering Faculty",
        description:
            "Shared house with 3 other students. Fully furnished, wifi included. Friendly environment.",
        price: "Rs.320/month",
        gender: "Male Only",
        images: [
            "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
        ],
        stats: { likes: 78, comments: 6 },
        comments: [
            { id: "bc4", user: "Tom Reeves", seed: "TomReeves", time: "20h ago", text: "How many people share the bathroom?" },
            { id: "bc5", user: "Dev Patel", seed: "DevPatel", time: "22h ago", text: "Great price for such a central location!" },
            { id: "bc6", user: "Amir Hassan", seed: "AmirHassan", time: "23h ago", text: "Is there parking available nearby?" },
        ],
    },
    {
        id: "b3",
        user: "Nisha R.",
        userSeed: "NishaR",
        time: "2d ago",
        title: "Modern Apartment — 2 Rooms",
        location: "1.0 km from Main Gate",
        description:
            "Brand new building. AC, hot water, fast broadband. Both rooms available from March 1st.",
        price: "Rs.600/month",
        gender: "Any",
        images: [
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
        ],
        stats: { likes: 45, comments: 3 },
        comments: [
            { id: "bc7", user: "Lena Müller", seed: "LenaMuller", time: "1d ago", text: "This looks gorgeous! Are pets allowed?" },
            { id: "bc8", user: "Sam Ortega", seed: "SamOrtega", time: "2d ago", text: "Any possibility of a shorter lease?" },
        ],
    },
];
