const mongoose = require('mongoose');
const slugify = require('slugify');

const RestaurantSchema = new mongoose.Schema({

        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters']
        },
        slug: String,
        qrcode: String,
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description can not be more than 500 characters']
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                'Please use a valid URL with HTTP or HTTPS'
            ]
        },
        phone: {
            type: String,
            maxlength: [20, 'Phone number can not be longer than 20 characters']
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        averagePoint: Number,
        photo: {
            type: String,
            default: 'no-photo.jpg'
        }
    }, {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        id: false
    }
);

RestaurantSchema.pre('save', function (next) {
    this.qrcode = "QR_" + this._id;
    next();
});


// Cascade delete courses when a bootcamp is deleted
RestaurantSchema.pre('remove', async function (next) {
    console.log(`Courses being removed from bootcamp ${this._id}`);
    await this.model('Menu').deleteMany({
        restaurant: this._id
    });
    next();
});


// Reverse populate with virtuals
RestaurantSchema.virtual('menus', {
    ref: 'Menu',
    localField: '_id',
    foreignField: 'restaurant',
    justOne: false
});


module.exports = mongoose.model('Restaurant', RestaurantSchema);