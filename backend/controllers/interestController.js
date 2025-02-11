const UserModel = require('../models/userModel');
// Add interest to user
exports.addInterest = async (req, res) => {
  try {
    const { topic, discipline } = req.body;
    
    if (!topic || !discipline) {
      return res.status(400).json({
        success: false,
        message: "Topic and discipline are required"
      });
    }
    

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          interests: {
            topic,
            discipline
          }
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Interest added successfully",
      interests: user.interests
    });
  } catch (error) {
    console.error('Error adding interest:', error);
    res.status(500).json({
      success: false,
      message: "Failed to add interest",
      error: error.message
    });
  }
};

// Remove interest from user
exports.removeInterest = async (req, res) => {
  try {
    const { topic, discipline } = req.params;
    
    if (!topic || !discipline) {
      return res.status(400).json({
        success: false,
        message: "Topic and discipline are required"
      });
    }
    
    // Remove interest from user
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          interests: { topic, discipline }
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Interest removed successfully",
      interests: user.interests
    });
  } catch (error) {
    console.error('Error removing interest:', error);
    res.status(500).json({
      success: false,
      message: "Failed to remove interest",
      error: error.message
    });
  }
};

// Get user's interested topics
exports.getInterests = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select('interests');
    
    res.status(200).json({
      success: true,
      interests: user.interests
    });
  } catch (error) {
    console.error('Error getting interests:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get interests",
      error: error.message
    });
  }
};

// Get user's watch history
exports.getWatchHistory = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select('watchHistory');
    res.status(200).json({ success: true, watchHistory: user.watchHistory });
  } catch (error) {
    console.error('Error getting watch history:', error);
    res.status(500).json({ success: false, message: "Failed to get watch history", error: error.message });
  }
};

// Add video to watch history
exports.addToWatchHistory = async (req, res) => {
  try {
    const { videoId, title, thumbnail, channelTitle, length } = req.body;
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Video ID is required"
      });
    }

    // First, remove the video if it already exists to avoid duplicates
    await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { watchHistory: { videoId: videoId } }
      }
    );

    // Then add the video to the beginning of the array
    await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $push: { 
          watchHistory: { 
            $each: [{ 
              videoId: videoId,
              title: title,
              thumbnail: thumbnail,
              channelTitle: channelTitle,
              length: length,
              watchedAt: new Date()
            }],
            $position: 0,
            $slice: 20
          }
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Added to watch history"
    });
  } catch (error) {
    console.error('Error adding to watch history:', error);
    res.status(500).json({
      success: false,
      message: "Failed to add to watch history",
      error: error.message
    });
  }
};
