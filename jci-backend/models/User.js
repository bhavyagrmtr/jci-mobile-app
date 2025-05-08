const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    occupation: {
        type: String,
        required: [true, 'Occupation is required'],
        trim: true
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        enum: {
            values: [
                'JCI ALIGARH SHINE',
                'JCI BAREILY JHUMKA CITY',
                'JCI BAREILY MAGNET CITY',
                'JCI BRAHMAVARTA',
                'JCI HATHRAS',
                'JCI HATHRAS GREATER',
                'JCI HATHRAS RAINBOW',
                'JCI HATHRAS VICTORY',
                'JCI HATHRAS SPARKLE',
                'JCI JHANSI CLASSIC',
                'JCI JHANSI FEMINA',
                'JCI JHANSI GOONJ',
                'JCI JHANSI UDAAN',
                'JCI KAIMGANJ GREATER',
                'JCI KANHA',
                'JCI KANPUR',
                'JCI KANPUR INDUSTRIAL',
                'JCI KANPUR LAVANYA',
                'JCI KASGANJ JAGRATI',
                'JCI MATHURA',
                'JCI MATHURA AANYA',
                'JCI MATHURA CITY',
                'JCI MATHURA ELITE (2024)',
                'JCI MATHURA GREATER',
                'JCI MATHURA KALINDI',
                'JCI MATHURA PANKHURI',
                'JCI MATHURA ROYAL',
                'JCI NOIDA NCR (2024)',
                'JCI RAE BAREILY',
                'JCI RANI LAXMIBAI',
                'JCI RATH',
                'JCI RUDRAPUR',
                'JCI RUDRAPUR QUEEN (2023)'
            ],
            message: '{VALUE} is not a valid JCI location'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    profilePicture: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add error handling for duplicate mobile numbers
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Mobile number already exists'));
    } else {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User; 