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
        
        // Write the updated content back to the file
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Added auth scripts to ${file}`);
    }
}); 