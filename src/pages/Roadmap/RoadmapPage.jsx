import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiChevronDown, FiChevronRight, FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import roadmapService from '../../services/roadmapService';
import CreateRoadmapModal from '../../components/Roadmap/CreateRoadmapModal';
import { toast } from 'react-hot-toast';

function RoadmapPage() {
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState([]);
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRoadmapsLoading, setMyRoadmapsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('trending');

  useEffect(() => {
    fetchRoadmaps();
    fetchMyRoadmaps();
  }, []);

  useEffect(() => {
    if (roadmapData.length > 0 && selectedDomain === 'trending') {
      // Keep trending as default, no need to change
    }
  }, [roadmapData, selectedDomain]);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const data = await roadmapService.getRoadmaps();
      setRoadmapData(data);
    } catch (err) {
      console.error('Error fetching roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRoadmaps = async () => {
    try {
      setMyRoadmapsLoading(true);
      const data = await roadmapService.getMyRoadmaps();
      setMyRoadmaps(data);
    } catch (err) {
      console.error('Error fetching my roadmaps:', err);
    } finally {
      setMyRoadmapsLoading(false);
    }
  };


  const handleCreateRoadmap = async (roadmapData) => {
    try {
      setSubmitting(true);
      await roadmapService.createRoadmap(roadmapData);
      setShowCreateModal(false);
      // Refresh my roadmaps
      await fetchMyRoadmaps();
    } catch (err) {
      console.error('Error creating roadmap:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) {
      return;
    }

    try {
      await roadmapService.deleteRoadmap(roadmapId);
      toast.success('Roadmap deleted');
      await fetchMyRoadmaps();
    } catch (err) {
      console.error('Error deleting roadmap:', err);
      toast.error('Could not delete the roadmap. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get all roadmaps for trending tab
  const getAllRoadmaps = () => {
    const allRoadmaps = [];
    roadmapData.forEach(domainData => {
      domainData.subdomains?.forEach(subdomainData => {
        subdomainData.roadmaps?.forEach(roadmap => {
          allRoadmaps.push({
            ...roadmap,
            domain: domainData.domain,
            subdomain: subdomainData.subdomain
          });
        });
      });
    });
    return allRoadmaps;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">

        <div className='flex mb-16'>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full mt-4 p-4 rounded-lg border border-dashed
                     border-gray-300 dark:border-gray-700
                     hover:border-purple-500/50 dark:hover:border-purple-500/50 
                     hover:bg-gray-50 dark:hover:bg-gray-800/50 
                     transition-all duration-200
                     text-gray-600 dark:text-gray-400 
                     hover:text-gray-900 dark:hover:text-white 
                     flex items-center justify-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create your own Roadmap</span>
          </button>
        </div>

        {/* My Roadmaps Section */}
        <div className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-300 mb-6">
            My Roadmaps
          </h2>
          
          {myRoadmapsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : myRoadmaps.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <FiPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't created any roadmaps yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Your First Roadmap
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {myRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700
                           hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-300 line-clamp-2">
                        {roadmap.title}
                      </h3>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                          className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                          title="View roadmap"
                        >
                          <FiArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoadmap(roadmap.id)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete roadmap"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Type:</span>
                        <span className="capitalize">{roadmap.learningType?.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Level:</span>
                        <span>{roadmap.skillLevel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        <span>Due: {formatDate(roadmap.deadline)}</span>
                      </div>
                    </div>
                    
                    {roadmap.description && (
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {roadmap.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-300 mb-6">
            Community Roadmaps
          </h2>

          {roadmapData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No roadmaps available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Domain Tabs - Horizontally scrollable and centered */}
              <div className="relative mb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex min-w-max px-4">
                      {/* Trending Tab */}
                      <button
                        onClick={() => setSelectedDomain('trending')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                          selectedDomain === 'trending'
                            ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>Trending</span>
                        </div>
                      </button>
                      
                      {/* Domain Tabs */}
                      {roadmapData.map((domainData) => (
                        <button
                          key={domainData.domain}
                          onClick={() => setSelectedDomain(domainData.domain)}
                          className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                            selectedDomain === domainData.domain
                              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{domainData.domain}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Fade effect for scrollable tabs */}
                <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent dark:from-zinc-900 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent dark:from-zinc-900 pointer-events-none"></div>
              </div>

              {/* Selected Domain Content */}
              {selectedDomain && (
                <div className="space-y-6">
                  {selectedDomain === 'trending' ? (
                    // Trending view - show all roadmaps in a grid
                    <div>
                      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">
                        Popular Roadmaps
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {getAllRoadmaps().map((roadmap, index) => (
                          <button
                            key={roadmap.id || roadmap.name || index}
                            onClick={() => navigate(`/roadmap/${roadmap.id || roadmap.name}`)}
                            className="flex items-center justify-between px-4 py-3 rounded-lg
                                    bg-white dark:bg-gray-800/50
                                    hover:bg-purple-50 dark:hover:bg-purple-900/20
                                    transition-all duration-200 
                                    border border-gray-200 dark:border-gray-700
                                    hover:border-purple-300 dark:hover:border-purple-600 
                                    group text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-900 dark:text-gray-100 font-medium text-sm block truncate">
                                {roadmap.title || roadmap.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                                {roadmap.domain} • {roadmap.subdomain}
                              </span>
                            </div>
                            <FiArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500
                                                 group-hover:text-purple-600 dark:group-hover:text-purple-400 
                                                 transition-colors flex-shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Domain-specific view - show roadmaps in a grid without subdomain grouping
                    (() => {
                      const currentDomain = roadmapData.find(d => d.domain === selectedDomain);
                      if (!currentDomain) return null;

                      const domainRoadmaps = [];
                      currentDomain.subdomains?.forEach(subdomainData => {
                        subdomainData.roadmaps?.forEach(roadmap => {
                          domainRoadmaps.push({
                            ...roadmap,
                            subdomain: subdomainData.subdomain
                          });
                        });
                      });

                      return (
                        <div>
                          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">
                            {currentDomain.domain} Roadmaps
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {domainRoadmaps.map((roadmap, index) => (
                              <button
                                key={roadmap.id || roadmap.name || index}
                                onClick={() => navigate(`/roadmap/${roadmap.id || roadmap.name}`)}
                                className="flex items-center justify-between px-4 py-3 rounded-lg
                                        bg-white dark:bg-gray-800/50
                                        hover:bg-purple-50 dark:hover:bg-purple-900/20
                                        transition-all duration-200 
                                        border border-gray-200 dark:border-gray-700
                                        hover:border-purple-300 dark:hover:border-purple-600 
                                        group text-left"
                              >
                                <div className="flex-1 min-w-0">
                                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm block truncate">
                                    {roadmap.title || roadmap.name}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                                    {roadmap.subdomain}
                                  </span>
                                </div>
                                <FiArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500
                                                     group-hover:text-purple-600 dark:group-hover:text-purple-400 
                                                     transition-colors flex-shrink-0 ml-2" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FiClock className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">
              More Roadmaps Coming Soon
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            We're working on adding more specialized roadmaps including DevOps, Full Stack, AI Engineer, and many more. Stay tuned for updates!
          </p>
        </div>
      </div>

      {/* Create Roadmap Modal */}
      <CreateRoadmapModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRoadmap}
        submitting={submitting}
      />
    </div>
  );
}

export default RoadmapPage; 