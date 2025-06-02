const fs = require('fs');
const path = require('path');

// Get all HTML files in the current directory
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Add auth scripts if they don't exist
    if (!content.includes('auth.js')) {
        content = content.replace(
            '</head>',
            `    <script src="js/auth.js"></script>
    <script src="js/navbar-auth.js"></script>
</head>`
        );
    }

    // Fix main navigation menu structure
    const mainNavPattern = /<div class="navbar-collapse collapse clearfix" id="navbarSupportedContent">[\s\S]*?<\/div>\s*<\/nav>/;
    const mainNavReplacement = `<div class="navbar-collapse collapse clearfix" id="navbarSupportedContent">
        <ul class="navigation clearfix">
            <li class="dropdown"><a href="#">Course</a>
                <ul>
                    <li><a href="featured-courses.html">Featured Courses</a></li>
                    <li><a href="latest-courses.html">Latest Courses</a></li>
                    <li><a href="category.html">Course Categories</a></li>
                    <li><a href="course-detail.html">Course Landing</a></li>
                    <li><a href="course-lesson.html">Course Lesson</a></li>
                </ul>
            </li>
            <li class="dropdown instructor-only"><a href="#">Instructor</a>
                <ul>
                    <li><a href="dashboard.html">Instructor Dashboard</a></li>
                    <li><a href="manage-course.html">Manage Courses</a></li>
                    <li><a href="edit-course.html">Edit Course</a></li>
                    <li><a href="earning.html">Earnings</a></li>
                    <li><a href="instructor-profile.html">Instructor Profile</a></li>
                    <li><a href="team.html">Popular Instructors</a></li>
                </ul>
            </li>
            <li class="dropdown student-only"><a href="#">Student</a>
                <ul>
                    <li><a href="enrolled-courses.html">Enrolled Courses</a></li>
                    <li><a href="certificate.html">Certificate Center</a></li>
                    <li><a href="test.html">Quiz</a></li>
                    <li><a href="result.html">Quiz Result</a></li>
                    <li><a href="student-profile.html">Student Profile</a></li>
                </ul>
            </li>
            <li class="dropdown"><a href="#">Pages</a>
                <ul>
                    <li><a href="price.html">Subscription</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="blog-detail.html">Blog Detail</a></li>
                    <li><a href="not-found.html">Error Page</a></li>
                    <li><a href="coming-soon.html">Coming Soon</a></li>
                    <li><a href="checkout.html">Checkout</a></li>
                </ul>
            </li>
        </ul>
    </div>
</nav>`;

    content = content.replace(mainNavPattern, mainNavReplacement);

    // Fix profile box structure
    const profileBoxPattern = /<div class="profile-box[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
    const profileBoxReplacement = `<div class="profile-box dropdown" id="someElementID5">
        <div class="btn btn-default dropdown-toggle">
            <span class="profile-image"><img src="images/resource/author-4.jpg" alt="" /></span>
            <i class="arrow flaticon-down-arrow"></i>
        </div>
        <div class="profile-content">
            <!-- This content will be dynamically updated by navbar-auth.js -->
        </div>
    </div>`;

    content = content.replace(profileBoxPattern, profileBoxReplacement);

    // Remove any duplicate navigation elements
    content = content.replace(/<ul class="pages">[\s\S]*?<\/ul>/g, '');

    // Fix sidenav-list structure
    const sidenavFix = `<!-- Sidebar Nav -->
<div class="sidenav-list">
    <ul class="navbar">
        <li><a href="index.html"><i class="icon flaticon-home"></i> Home</a></li>
        <li><a href="course-lesson.html"><i class="icon flaticon-book"></i> Course Lesson</a></li>
        <li><a href="category.html"><i class="icon flaticon-test"></i> Categories</a></li>
        <li class="instructor-only"><a href="dashboard.html"><i class="icon flaticon-report"></i> Dashboard</a></li>
        <li class="instructor-only"><a href="manage-course.html"><i class="icon flaticon-test"></i> Manage Course</a></li>
        <li class="instructor-only"><a href="earning.html"><i class="icon flaticon-pie-chart-1"></i> Earning</a></li>
        <li class="student-only"><a href="enrolled-courses.html"><i class="icon flaticon-file"></i> Enrolled Courses</a></li>
        <li class="student-only"><a href="certificate.html"><i class="icon flaticon-new-window"></i> Certificate</a></li>
        <li><a href="team.html"><i class="icon flaticon-file"></i> Instructors</a></li>
        <li><a href="contact.html"><i class="icon flaticon-contact"></i> Contact Us</a></li>
        <li><a href="help.html"><i class="icon flaticon-information"></i> Help</a></li>
    </ul>
</div>
<!-- End Sidebar Nav -->`;

    content = content.replace(/<!-- Sidebar Nav -->[\s\S]*?<!-- End Sidebar Nav -->/g, sidenavFix);

    // Fix hidden bar structure
    const hiddenBarFix = `<!-- Hidden Navigation Bar -->
<section class="hidden-bar left-align">
    <div class="color-layer"></div>
    <div class="hidden-bar-closer">
        <span class="flaticon-multiply"></span>
    </div>
    <!-- Hidden Bar Wrapper -->
    <div class="hidden-bar-wrapper">
        <ul class="pages-list">
            <li class="active"><a href="index.html"><span class="icon flaticon-home"></span>Home</a></li>
            <li><a href="featured-courses.html"><span class="icon flaticon-book"></span>Featured Courses</a></li>
            <li><a href="course-lesson.html"><span class="icon flaticon-category"></span>Courses Lesson</a></li>
            <li><a href="category.html"><span class="icon flaticon-test"></span>Course Categories</a></li>
            <li><a href="latest-courses.html"><span class="icon flaticon-subscription"></span>Latest Courses</a></li>
            <li><a href="course-detail.html"><span class="icon flaticon-new-window"></span>Course Landing</a></li>
            <li><a href="team.html"><span class="icon flaticon-instructor"></span>Popular Instructors</a></li>
        </ul>
        <div class="heading">Instructor</div>
        <ul class="pages-list instructor-only">
            <li><a href="dashboard.html"><span class="icon flaticon-home"></span>Dashboard</a></li>
            <li><a href="manage-course.html"><span class="icon flaticon-test"></span>Manage Courses</a></li>
            <li><a href="earning.html"><span class="icon flaticon-scholarship"></span>Earnings</a></li>
            <li><a href="edit-course.html"><span class="icon flaticon-report"></span>Edit Course</a></li>
            <li><a href="instructor-profile.html"><span class="icon flaticon-file"></span>Instructor Profile</a></li>
        </ul>
        <div class="heading">Student</div>
        <ul class="pages-list student-only">
            <li><a href="price.html"><span class="icon flaticon-money-bag"></span>Pricing</a></li>
            <li><a href="enrolled-courses.html"><span class="icon flaticon-test"></span>Enrolled Courses</a></li>
            <li><a href="certificate.html"><span class="icon flaticon-skills"></span>Certificate Center</a></li>
            <li><a href="test.html"><span class="icon flaticon-quiz"></span>Quiz</a></li>
            <li><a href="result.html"><span class="icon flaticon-document"></span>Quiz Result</a></li>
            <li><a href="student-profile.html"><span class="icon flaticon-student"></span>Student Profile</a></li>
        </ul>
        <div class="heading">Pages</div>
        <ul class="pages-list">
            <li><a href="blog.html"><span class="icon flaticon-social-media"></span>Blog</a></li>
            <li><a href="blog-detail.html"><span class="icon flaticon-article"></span>Blog Detail</a></li>
            <li><a href="not-found.html"><span class="icon flaticon-garbage"></span>Not Found</a></li>
            <li class="guest-only"><a href="login.html"><span class="icon flaticon-contract"></span>Sign In</a></li>
            <li class="guest-only"><a href="sign-up.html"><span class="icon flaticon-clipboard"></span>Sign Up</a></li>
            <li><a href="feedback.html"><span class="icon flaticon-thumb-up"></span>Feedback</a></li>
            <li><a href="checkout.html"><span class="icon flaticon-checkout"></span>Checkout</a></li>
            <li><a href="contact.html"><span class="icon flaticon-contact"></span>Contact Us</a></li>
            <li><a href="setting.html"><span class="icon flaticon-settings-1"></span>Settings</a></li>
            <li><a href="help.html"><span class="icon flaticon-information"></span>Help</a></li>
        </ul>
    </div>
    <!--Copyright Text-->
    <div class="copyright-text">Copyright &copy; 2020 Genter</div>
</section>`;

    content = content.replace(/<!-- Hidden Navigation Bar -->[\s\S]*?<\/section>/g, hiddenBarFix);

    // Write the updated content back to the file
    fs.writeFileSync(file, content, 'utf8');
}); 