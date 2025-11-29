const College = require("../models/college.js");

const bcrypt = require("bcryptjs");

const generateCollegeId = () => {
    return "CLG-" + Math.floor(100000 + Math.random() * 900000);
};

exports.registerCollege = async (req, res) => {
  console.log("REQ BODY:", req.body); 
    try {
        const {
            name,
            location,
            city,
            state,
            officialWebsite,
            officialEmail,
            adminEmail,
            adminPassword
        } = req.body;

        // Check duplicate official email
        const existing = await College.findOne({ officialEmail });
        if (existing) {
            return res.json({
                success: false,
                error: "College with this email already exists"
            });
        }

        // Hash admin password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Generate ID
        const collegeId = generateCollegeId();

        // Save to DB
        const college = await College.create({
            collegeId,
            name,
            location,
            city,
            state,
            officialWebsite,
            officialEmail,
            admin: {
                email: adminEmail,
                password: hashedPassword
            }
        });

        return res.json({
            success: true,
            data: {
                collegeId: college.collegeId
            }
        });

    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            error: "Server error"
        });
    }
};
