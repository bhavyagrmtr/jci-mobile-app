const bcrypt = require('bcryptjs');

const password = 'admin123'; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error generating hash:', err);
        return;
    }
    console.log('Generated hash for password:', password);
    console.log('Hash:', hash);
    console.log('\nCopy this hash and replace the ADMIN_PASSWORD in server.js');
}); 