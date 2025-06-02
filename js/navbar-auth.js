// Function to update all navigation elements based on auth state
function updateNavigation() {
    const isLoggedIn = Auth.isLoggedIn();
    const currentUser = isLoggedIn ? Auth.getCurrentUser() : null;
    
    // Update guest elements (Sign In, Sign Up)
    const guestElements = document.querySelectorAll('.guest-only');
    guestElements.forEach(elem => {
        elem.style.display = isLoggedIn ? 'none' : '';
    });

    // Update instructor elements
    const instructorElements = document.querySelectorAll('.instructor-only');
    instructorElements.forEach(elem => {
        elem.style.display = (isLoggedIn && currentUser.role === 'instructor') ? '' : 'none';
    });

    // Update student elements
    const studentElements = document.querySelectorAll('.student-only');
    studentElements.forEach(elem => {
        elem.style.display = (isLoggedIn && currentUser.role === 'student') ? '' : 'none';
    });

    // Update profile box content
    const profileContent = document.querySelector('.profile-content');
    if (profileContent) {
        if (isLoggedIn) {
            profileContent.innerHTML = `
                <div class="profile-detail">
                    <div class="profile-info">
                        <h6>${currentUser.name}</h6>
                        <p>${currentUser.email}</p>
                    </div>
                    <ul>
                        <li><a href="${currentUser.role}-profile.html">My Profile</a></li>
                        <li><a href="setting.html">Settings</a></li>
                        <li><a href="#" onclick="Auth.logout(); return false;">Logout</a></li>
                    </ul>
                </div>
            `;
        } else {
            profileContent.innerHTML = `
                <div class="profile-detail">
                    <ul>
                        <li class="guest-only"><a href="login.html">Sign In</a></li>
                        <li class="guest-only"><a href="sign-up.html">Sign Up</a></li>
                    </ul>
                </div>
            `;
        }
    }

    // Remove any duplicate navigation elements
    const duplicateNavs = document.querySelectorAll('.pages');
    duplicateNavs.forEach(nav => nav.remove());
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateNavigation);

// Call whenever auth state changes
window.addEventListener('auth-state-changed', updateNavigation); 