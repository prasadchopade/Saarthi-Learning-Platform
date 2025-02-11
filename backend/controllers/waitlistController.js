const nodemailer = require('nodemailer');
const Waitlist = require('../models/waitlistModel');

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || process.env.ZOHO_EMAIL;
const APP_URL = process.env.APP_URL || 'https://saarthi.xyz';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  secure: true,
  auth: {
    user: `${process.env.ZOHO_EMAIL}`,
    pass: `${process.env.ZOHO_PASS}`,
  },
});

const sendConfirmationEmail = async (email) => {
  const mailOptions = {
    from: `"Saarthi" <${SUPPORT_EMAIL}>`,
    to: email,
    subject: 'Welcome to Saarthi!!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="background-color: #f7fbff; padding: 30px; text-align: center; border-radius: 10px;">
    <h1 style="color: #4a90e2; font-size: 28px; margin-bottom: 20px;">Welcome to Saarthi!</h1>
    <p style="font-size: 18px; margin-bottom: 20px;">Hello! We’re the team behind Saarthi, the AI powered learning platform, and we want to give you a huge shoutout for hopping on this journey with us!</p>
    <p style="font-size: 18px; margin-bottom: 20px;">Thanks for joining the waitlist – it’s an exciting ride ahead, and we’re thrilled to have you along as we work to change the way we all learn.</p>
    <p style="font-size: 16px; margin-bottom: 20px;">We’ve got some cool updates and exclusive insights coming all your way soon, so stay tuned! In the meantime, if you have any questions, hit me up.</p>
    <p style="margin-top: 30px;">
      <a href="${APP_URL}" style="display: inline-block; padding: 12px 30px; font-size: 16px; color: white; background-color: #4a90e2; text-decoration: none; border-radius: 5px;">
        Check Out Saarthi
      </a>
    </p>
  </div>
  <div style="background-color: #eef3f8; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
    <p style="color: #888; font-size: 14px;">&copy; ${new Date().getFullYear()} Saarthi. All rights reserved. | <a href="mailto:${SUPPORT_EMAIL}" style="color: #4a90e2; text-decoration: none;">Contact Us</a></p>
  </div>
</div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendApprovalEmail = async (email) => {
  const mailOptions = {
    from: `"Saarthi" <${SUPPORT_EMAIL}>`,
    to: email,
    subject: 'Your Access to Saarthi is here!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="background-color: #f7fbff; padding: 30px; text-align: center; border-radius: 10px;">
    <h1 style="color: #4a90e2; font-size: 28px; margin-bottom: 20px;">Your Access to Saarthi is here!</h1>
    <p style="font-size: 18px; margin-bottom: 20px;">Great news! Your access to Saarthi has been approved.</p>
    <p style="font-size: 16px; margin-bottom: 20px;">We're super excited to have you on our platform and can't wait to see how you use Saarthi to enhance your learning journey!</p>
    <p style="font-size: 16px; margin-bottom: 20px;">Before you log in, we would like to inform you that we are still in beta and some AI features may not be available without you providing a gemini API key. We recommend you to provide your own free gemini API key to use the AI features.</p>
    <p style="margin-top: 30px;">
      <a href="${APP_URL}" style="display: inline-block; padding: 12px 30px; font-size: 16px; color: white; background-color: #4a90e2; text-decoration: none; border-radius: 5px;">
      Start Using Saarthi
      </a>
    </p>
  </div>
  <div style="background-color: #eef3f8; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
    <p style="color: #888; font-size: 14px;">&copy; ${new Date().getFullYear()} Saarthi. All rights reserved. | <a href="mailto:${SUPPORT_EMAIL}" style="color: #4a90e2; text-decoration: none;">Contact Us</a></p>
  </div>
</div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const addEmailToWaitlist = async (req, res) => {
  const { email } = req.body;
  
  try {
    const existingEmail = await Waitlist.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in waitlist' });
    }

    const newWaitlistEntry = new Waitlist({ email });
    await newWaitlistEntry.save();
   
    await sendConfirmationEmail(email);

    res.status(201).json({ message: 'Congrats! You are added to the waitlist' });
  } catch (error) {
    console.error('Error adding email to waitlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getWaitlistUsers = async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Support filtering by approval status
    const filter = {};
    if (req.query.approved === 'true') {
      filter.approved = true;
    } else if (req.query.approved === 'false') {
      filter.approved = false;
    }
    
    // Get total count for pagination
    const total = await Waitlist.countDocuments(filter);
    
    // Get waitlist users with pagination and sorting
    const waitlistUsers = await Waitlist.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    console.log(waitlistUsers);
    res.status(200).json({
      users: waitlistUsers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching waitlist users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const approveWaitlistUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const waitlistUser = await Waitlist.findById(id);
    
    if (!waitlistUser) {
      return res.status(404).json({ message: 'Waitlist user not found' });
    }
    
    if (waitlistUser.approved) {
      return res.status(400).json({ message: 'User is already approved' });
    }
    
    // Update the waitlist entry to approved
    waitlistUser.approved = true;
    await waitlistUser.save();
    
    // Send approval email
    await sendApprovalEmail(waitlistUser.email);
    
    res.status(200).json({ message: 'User approved successfully', user: waitlistUser });
  } catch (error) {
    console.error('Error approving waitlist user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const approveMultipleUsers = async (req, res) => {
  const { ids } = req.body;
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty user IDs array' });
  }
  
  try {
    // Find all users that match the IDs and are not already approved
    const usersToApprove = await Waitlist.find({ 
      _id: { $in: ids },
      approved: false 
    });
    
    if (usersToApprove.length === 0) {
      return res.status(400).json({ message: 'No valid users to approve' });
    }
    
    // Update all users to approved status
    const updateResult = await Waitlist.updateMany(
      { _id: { $in: ids }, approved: false },
      { $set: { approved: true } }
    );
    
    // Send approval emails to all approved users
    const emailPromises = usersToApprove.map(user => sendApprovalEmail(user.email));
    await Promise.all(emailPromises);
    
    res.status(200).json({ 
      message: 'Users approved successfully', 
      count: updateResult.modifiedCount,
      users: usersToApprove
    });
  } catch (error) {
    console.error('Error approving multiple waitlist users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteWaitlistUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await Waitlist.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Waitlist user not found' });
    }
    
    res.status(200).json({ message: 'User removed from waitlist successfully' });
  } catch (error) {
    console.error('Error deleting waitlist user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { 
  addEmailToWaitlist,
  getWaitlistUsers,
  approveWaitlistUser,
  approveMultipleUsers,
  deleteWaitlistUser
};
