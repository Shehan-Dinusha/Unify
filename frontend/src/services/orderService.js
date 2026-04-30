import api from "./api";

const orderService = {
    /**
     * Create a new order (for products/merchandise)
     * @param {Object} orderData - { userId, productId, quantity, totalAmount, options: { size, color } }
     */
    createOrder: async (orderData) => {
        try {
            const response = await api.post("/orders", orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Create a Stripe Checkout Session
     * @param {Object} sessionData - { orderId, amount, productName, successUrl, cancelUrl }
     */
    createCheckoutSession: async (sessionData) => {
        try {
            const response = await api.post("/payments/create-checkout-session", sessionData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Create a new booking (for events/services)
     * @param {Object} bookingData - { userId, eventId, totalAmount, status }
     */
    createBooking: async (bookingData) => {
        try {
            const response = await api.post("/bookings", bookingData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Fetch orders for a student
     */
    getStudentOrders: async (userId) => {
        try {
            const response = await api.get(`/orders/student/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Fetch bookings for a student
     */
    getStudentBookings: async (userId) => {
        try {
            const response = await api.get(`/bookings/student/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get single order details
     */
    getOrderDetails: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get single booking details
     */
    getBookingDetails: async (bookingId) => {
        try {
            const response = await api.get(`/bookings/${bookingId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Fetch bookings for a specific event
     */
    getBookingsByEvent: async (eventId) => {
        try {
            const response = await api.get(`/bookings/event/${eventId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Bulk update booking status
     */
    bulkUpdateBookingStatus: async (bookingIds, status) => {
        try {
            const response = await api.patch(`/bookings/bulk-status`, { bookingIds, status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Update booking status
     */
    updateBookingStatus: async (bookingId, statusData) => {
        try {
            const response = await api.patch(`/bookings/${bookingId}/status`, statusData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Fetch orders for a club (seller)
     */
    getClubOrders: async (userId) => {
        try {
            const response = await api.get(`/orders/club/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Update order status
     */
    updateOrderStatus: async (orderId, statusData) => {
        try {
            const response = await api.patch(`/orders/${orderId}/status`, statusData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Fetch orders for a specific product
     */
    getOrdersByProduct: async (productId) => {
        try {
            const response = await api.get(`/orders/product/${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Bulk update order status
     */
    bulkUpdateOrderStatus: async (orderIds, status) => {
        try {
            const response = await api.patch(`/orders/bulk-status`, { orderIds, status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /* ─── Analytics Methods ─── */

    getClubOrderStats: async (userId) => {
        try {
            const response = await api.get(`/orders/analytics/stats/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getClubOrderTrends: async (userId, days = 30) => {
        try {
            const response = await api.get(`/orders/analytics/trends/${userId}?days=${days}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getClubTopProducts: async (userId) => {
        try {
            const response = await api.get(`/orders/analytics/top-products/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getClubBuyerDemographics: async (userId) => {
        try {
            const response = await api.get(`/orders/analytics/demographics/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getClubRevenueBreakdown: async (userId) => {
        try {
            const response = await api.get(`/orders/analytics/revenue/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get all posts (products + events) owned by a club user
     */
    getClubPosts: async (userId) => {
        try {
            const response = await api.get(`/orders/club/${userId}/posts`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Toggle whether a club post is visible in the feed
     * @param {string} type - 'club-product' or 'club-event'
     * @param {number} postId
     */
    togglePostVisibility: async (type, postId) => {
        try {
            const response = await api.patch(`/orders/posts/${type}/${postId}/visibility`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};


export default orderService;
