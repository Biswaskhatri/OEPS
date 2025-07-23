const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");


const crypto = require('crypto');

let fetchPromise;

(async () => {
  try {
    const nodeFetchModule = await import('node-fetch');
    fetchPromise = Promise.resolve(nodeFetchModule.default);
    console.log('authController.js: node-fetch module import initiated successfully.');
  } catch (e) {
    console.error('authController.js: Failed to initiate node-fetch module import:', e);
    fetchPromise = Promise.reject(e); // Propagate the error if import fails
  }
})();




exports.postSignup = [
 
  
  async(req, res, next) => {
    const {firstName, lastName, email, password, role} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    
       return res.status(422).json({
    success: false,
    errors: errors.array().map(err => err.msg)
  });
    }

  
 try {

     const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
      await user.save();
      res.status(201).json({ success: true, message: "Signup successful" });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },





]

exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;

  try{
  const user = await User.findOne({email});
  if (!user) {
        return res.status(422).json({
        success: false,
        message: "User does not exist" 
      });

  }

   if (user.isGoogleAuth) {
      return res.status(401).json({ success: false, message: "This account was registered with Google. Please sign in with Google." });
    }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    
    return res.status(422).json({ success: false, message: "Invalid password" });
  }

console.log("User Role Before Saving to Session:", user.role);


  req.session.isLoggedIn = true;
 req.session.user = {
  _id: user._id,
  email: user.email,
  firstName: user.firstName,
  role: user.role,
};

req.session.userId = user._id;

  await req.session.save();

  
  return res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.session.user
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    //
    //res.redirect("/login");

      res.status(200).json({ success: true, message: "Logged out" });
  })
}





exports.googleAuth = async (req, res) => {
  console.log('authController.js: googleAuth function called.');
  try {
    const actualFetch = await fetchPromise;
    if (!actualFetch) {
      console.error('authController.js: node-fetch is not available. Cannot proceed with Google Auth.');
      return res.status(500).json({ success: false, message: 'Server error: Fetch library not initialized.' });
    }

    const { code } = req.body; // <--- Expecting 'code' now, not 'idToken'

    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required.' });
    }

    
    const redirectUri = 'http://localhost:5173'; // 

     const tokenExchangePayload = {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    };

    console.log('authController.js: Sending token exchange request to Google with payload:', tokenExchangePayload); // <--- DEBUG LOG

    
    const tokenExchangeUrl = 'https://oauth2.googleapis.com/token';
    const tokenExchangeResponse = await actualFetch(tokenExchangeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenExchangePayload).toString(),
    });

    // Check if the response itself indicates an HTTP error (e.g., 400, 401)
    if (!tokenExchangeResponse.ok) {
      const errorText = await tokenExchangeResponse.text(); // Get raw text to see full error
      console.error('authController.js: Google token exchange HTTP error:', tokenExchangeResponse.status, errorText); // <--- DEBUG LOG
      try {
        const errorJson = JSON.parse(errorText);
        return res.status(tokenExchangeResponse.status).json({ success: false, message: 'Failed to exchange authorization code.', details: errorJson.error_description || errorJson.error || 'Unknown error from Google.' });
      } catch (parseError) {
        return res.status(tokenExchangeResponse.status).json({ success: false, message: 'Failed to exchange authorization code.', details: `Non-JSON error from Google: ${errorText}` });
      }
    }

    const tokenData = await tokenExchangeResponse.json();

    if (tokenData.error) {
      console.error('Error exchanging authorization code:', tokenData.error_description || tokenData.error);
      return res.status(401).json({ success: false, message: 'Failed to exchange authorization code.', details: tokenData.error_description || tokenData.error });
    }

    const idToken = tokenData.id_token; // <--- Now we get the id_token here!
    if (!idToken) {
      console.error('ID token missing after code exchange:', tokenData);
      return res.status(500).json({ success: false, message: 'ID token missing after authorization code exchange.' });
    }

    
    const [header, payload, signature] = idToken.split('.');
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());

    
    if (decodedPayload.aud !== GOOGLE_CLIENT_ID) {
      console.error('ID token audience mismatch after exchange:', decodedPayload.aud, 'expected:', GOOGLE_CLIENT_ID);
      return res.status(401).json({ success: false, message: 'Invalid ID token audience after exchange.' });
    }
    if (!['accounts.google.com', 'https://accounts.google.com'].includes(decodedPayload.iss)) {
      console.error('ID token issuer mismatch after exchange:', decodedPayload.iss);
      return res.status(401).json({ success: false, message: 'Invalid ID token issuer after exchange.' });
    }
    if (decodedPayload.exp * 1000 < Date.now()) {
      console.error('ID token expired after exchange.');
      return res.status(401).json({ success: false, message: 'ID token expired after exchange.' });
    }


    const { email, name, picture } = decodedPayload; // User info from ID token
    const firstName = name ? name.split(' ')[0] : 'GoogleUser';
    const lastName = name ? name.split(' ').slice(1).join(' ') : '';
    let userRole = "student"; // Default role for new Google sign-ups

    let userInMongoDB = null;

    try {
      // 3. Check if the user already exists in your MongoDB database
      userInMongoDB = await User.findOne({ email: email });

      if (userInMongoDB) {
        console.log('User already exists in MongoDB:', userInMongoDB.email);
        userRole = userInMongoDB.role; 
        userInMongoDB.firstName = userInMongoDB.firstName || firstName;
        userInMongoDB.lastName = userInMongoDB.lastName || lastName;
        userInMongoDB.photoURL = picture || userInMongoDB.photoURL;
        userInMongoDB.lastLogin = new Date();
        userInMongoDB.isGoogleAuth = true;
        await userInMongoDB.save();
      } else {
        // 4. If user does not exist in MongoDB, create a new one
        console.log('User not found in MongoDB, creating new user...');
        const newUser = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12),
          userType: userRole,
          isGoogleAuth: true,
          photoURL: picture,
          lastLogin: new Date(),
        });
        userInMongoDB = await newUser.save();
        console.log('New user created in MongoDB:', userInMongoDB.email);
      }

    } catch (dbError) {
      console.error('Error interacting with MongoDB during Google Auth:', dbError);
      return res.status(500).json({ success: false, message: 'Database operation failed.', details: dbError.message });
    }

    // Return user information to the frontend
    res.status(200).json({
      success: true,
      message: 'Google authentication successful.',
      user: {
        _id: userInMongoDB._id,
        email: userInMongoDB.email,
        firstName: userInMongoDB.firstName,
        role: userInMongoDB.role,
      }
    });

  } catch (error) {
    console.error('Error during Google Auth code exchange or verification:', error);
    res.status(500).json({ success: false, message: 'Authentication failed.', details: error.message });
  }
};
