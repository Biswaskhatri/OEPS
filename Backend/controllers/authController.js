const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

/*exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    user: null,
    validationErrors: [],
    oldInput: { email: "" }
  });
};
*/



/*exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    user: null,
    validationErrors: [],
    oldInput: { firstName: "", lastName: "", email: "", userType: "" }
  });
};
*/





exports.postSignup = [
 /* check("firstName")
  .trim()
  .isLength({min: 2})
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contain only alphabets"),

  check("lastName")
  .matches(/^[A-Za-z\s]*$/)
  .withMessage("Last Name should contain only alphabets"),

  check("email")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min: 5})
  .withMessage("Password should be atleast 5 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@&]/)
  .withMessage("Password should contain atleast one special character")
  .trim(),

  check("confirmPassword")
  .trim()
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(['student'])
  .withMessage("Invalid user type"),

  check("terms")
  .notEmpty()
  .withMessage("Please accept the terms and conditions")
  .custom((value, {req}) => {
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),
  */
  
  async(req, res, next) => {
    const {firstName, lastName, email, password, userType} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     /* return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        validationErrors: errors.array().map(err => err.msg),
        oldInput: {firstName, lastName, email, password, userType},
        user: {},
      });
      */

       return res.status(422).json({
    success: false,
    errors: errors.array().map(err => err.msg)
  });
    }

   /*  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({firstName, lastName, email, password: hashedPassword, userType});
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
    }).catch(err => {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        validationErrors: [err.message],
        oldInput: {firstName, lastName, email, userType},
        user: {},
      });
    });
  }*/
 try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType,
      });
      await user.save();
      res.status(201).json({ success: true, message: "Signup successful" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },





]

exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;

  try{
  const user = await User.findOne({email});
  if (!user) {
   /* return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      validationErrors: ["User does not exist"],
      oldInput: {email},
      user: {},
    });
    */
   return res.status(422).json({
  success: false,
  message: "User does not exist" // or "Invalid password"
});

  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    /*return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
     validationErrors: ["Invalid Password"],
      oldInput: {email},
      user: {},
    });
    */
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

  // res.redirect("/");
  return res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.session.user
    });

  } catch (err) {
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