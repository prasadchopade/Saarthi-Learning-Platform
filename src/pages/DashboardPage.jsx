import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  VideoSection,
  WatchHistorySection,
  NoInterestsBanner,
  DashboardSkeleton
} from "../components/Dashboard";
import dashboardService from "../services/dashboardService";

const Dashboard = () => {
  const [userInterests, setUserInterests] = useState([]);
  const [topicVideos, setTopicVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [interestsLoading, setInterestsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState({});
  const [watchHistory, setWatchHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setInterestsLoading(true);

      const [interestsData, watchHistoryData] = await Promise.all([
        dashboardService.getUserInterests(),
        dashboardService.getWatchHistory()
      ]);

      // Handle watch history
      if (watchHistoryData.success) {
        const recentVideos = watchHistoryData.watchHistory.slice(-20).reverse();
        setWatchHistory(recentVideos);
      }

      // Handle user interests
      if (interestsData.success && interestsData.interests) {
        setUserInterests(interestsData.interests);
        setInterestsLoading(false);
        
        // Then fetch videos for each interest topic
        await fetchVideosForInterests(interestsData.interests);
      } else {
        setInterestsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setInterestsLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideosForInterests = async (interests) => {
    if (!interests || interests.length === 0) return;

    // Initialize loading state for each topic
    const initialLoadingState = {};
    interests.forEach(interest => {
      initialLoadingState[interest.topic] = true;
    });
    setVideosLoading(initialLoadingState);

    // Fetch videos for each topic
    const videoPromises = interests.map(async (interest) => {
      try {
        const videosData = await dashboardService.getTopicVideos(
          interest.discipline, 
          interest.topic
        );
        
        if (videosData.success) {
          setTopicVideos(prev => ({
            ...prev,
            [interest.topic]: videosData.videos || []
          }));
        }
        
        setVideosLoading(prev => ({
          ...prev,
          [interest.topic]: false
        }));
      } catch (error) {
        console.error(`Error fetching videos for topic ${interest.topic}:`, error);
        setVideosLoading(prev => ({
          ...prev,
          [interest.topic]: false
        }));
      }
    });

    await Promise.all(videoPromises);
  };

  const handleVideoSelect = async (videoId, title, thumbnail, channelTitle, length) => {
    try {
      await dashboardService.addToWatchHistory(videoId, title, thumbnail, channelTitle, length);
      const videoDetails = {
        id: videoId,
        title,
        thumbnail,
        channelTitle,
        length
      };
      navigate(`/video/${videoId}`, { state: { videoDetails } });
    } catch (error) {
      console.error("Error adding to watch history:", error);
      navigate(`/video/${videoId}`);
    }
  };


  return (
    <div className="min-h-screen no-scrollbar bg-gray-50 dark:bg-zinc-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6 w-full">

        {/* Main Content */}
        {loading && interestsLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-8 w-full overflow-x-hidden">
            {/* Watch History Section */}
            <WatchHistorySection 
              watchHistory={watchHistory}
              onVideoSelect={handleVideoSelect}
            />

            {/* Topic Sections */}
            {userInterests.map(interest => (
              <VideoSection
                key={interest.topic}
                title={interest.topic}
                videos={topicVideos[interest.topic]}
                onVideoSelect={handleVideoSelect}
                loading={videosLoading[interest.topic]}
              />
            ))}

            {/* No Interests Banner for new users */}
            {!interestsLoading && userInterests.length === 0 && (
              <NoInterestsBanner />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;