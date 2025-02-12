import { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import { useNavigate, useLocation } from "react-router-dom";
import SearchResults from "../components/Search/SearchResults";
import { searchService } from "../services/searchService";
import dashboardService from "../services/dashboardService";

const SearchResultPage = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryFromUrl = queryParams.get('query');
    
    if (queryFromUrl) {
      setSearchTerm(queryFromUrl);
      fetchVideos(queryFromUrl);
    } else if (searchTerm) {
      fetchVideos(searchTerm);
    }
  }, [location.search, searchTerm, setSearchTerm]);

  const fetchVideos = async (query) => {
    setLoading(true);
    try {
      const videos = await searchService.searchVideos(query);
      setVideos(videos);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-900 p-6">
      <SearchResults
        videos={videos}
        loading={loading}
        onVideoSelect={handleVideoSelect}
      />
    </div>
  );
};

export default SearchResultPage;
