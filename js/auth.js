// User management using localStorage
const Auth = {
    // Initialize users array in localStorage if it doesn't exist
    init() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
    },

    // Register a new user
    register(userData) {
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Check if user already exists
        if (users.find(user => user.email === userData.email)) {
            throw new Error('User already exists');
        }

        // Add new user
        const newUser = {
            id: Date.now().toString(), // Simple unique ID
            ...userData,
            createdAt: new Date().toISOString(),
            role: userData.role || 'student'
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after registration
        this.login(userData.email, userData.password);
        
        return newUser;
    },

    // Login user
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Store current user in session
        const currentUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return currentUser;
    },

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem('currentUser');
    },

    // Get current user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    },

    // Update user profile
    updateProfile(userId, updates) {
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Update user data
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user if it's the logged-in user
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            localStorage.setItem('currentUser', JSON.stringify({
                ...currentUser,
                ...updates
            }));
        }

        return users[userIndex];
    }
};

// Initialize auth when script loads
Auth.init(); 