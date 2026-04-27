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
    }
};

export default orderService;
