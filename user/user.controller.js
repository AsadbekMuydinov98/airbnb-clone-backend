const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

async function userRegister(req, res) {
    const { name, email, password } = req.body;
    try {
        if(name=='' || email=='' || password=='') {
            return res.status(422).json({ message: 'All areas must fill' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).json({ message: 'This email is already taken' });
        }

        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const newUser = await User.create({
            name, email, password: hashedPassword,
        });

        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email,
        }, jwtSecret);

        const response = {
            user: newUser, token
        };

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function userLogin(req, res) {
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (!passOk) {
            return res.status(422).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({
            email: userDoc.email,
            id: userDoc._id
        }, jwtSecret);

        // Send response with user information and token
        res.json({ user: userDoc, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function userProfile(req, res) {
    const token =await req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            try {
                const {name, email, _id} = await User.findById(userData.id);
                res.json({user:{name, email, _id}, token});
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } else {
        res.json(null);
    }
}


async function logout(req, res) {
    res.cookie('token', '').json(true);
}


module.exports = {
    userRegister,
    userLogin,
    userProfile,
    logout,
}