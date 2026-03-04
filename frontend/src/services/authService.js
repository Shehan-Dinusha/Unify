export const login = async (identifier, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation
      if (password.length >= 8 && identifier.length > 0) {
        resolve({ 
          success: true, 
          user: { 
            name: "Test User", 
            email: identifier 
          },
          token: "mock-jwt-token" 
        });
      } else {
        reject({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
    }, 1500); // 1.5s delay to show loading state
  });
};
