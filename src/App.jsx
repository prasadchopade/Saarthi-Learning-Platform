import React, { useEffect } from "react";


import { PrivateRoute } from "./utils/privateRoute";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from 'react-hot-toast';
import { warmUpApi } from "./services/api";

import LandingPage from "./pages/LandingPage/LandingPage";
import PrivacyPolicyPage from "./pages/LandingPage/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/LandingPage/TermsOfServicePage";

import NotFound from "./components/Common/NotFound";
import MainLayout from "./layouts/MainLayout";
import ComingSoonPage from "./pages/ComingSoonPage";


import DashboardPage from "./pages/DashboardPage";
import SearchResultPage from "./pages/SearchResultPage";
import UserProfilePage from "./pages/ProfilePage";
import RoadmapPage from "./pages/Roadmap/RoadmapPage";
import RoadmapContentPage from "./pages/Roadmap/RoadmapContentPage";
import CreatorPage from "./pages/CreatorPage";
import PresentationPage from "./pages/PresentationPage";

import Player from "./pages/VideoPage";
import { CodeProvider } from "./context/CodeContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SearchProvider } from "./context/SearchContext";
import { SidebarProvider } from "./context/SideBarContext";

function App() {

  // The API sleeps when idle on the free tier. Ping it as soon as the app
  // loads so it is usually awake by the time anyone signs in.
  useEffect(() => {
    warmUpApi();
  }, []);

  const GoogleAuthWrapper = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <LandingPage />
    </GoogleOAuthProvider>
  );

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <ThemeProvider>
          <CodeProvider>
          <SearchProvider>
          <SidebarProvider>
            <Routes>
                  <Route path="/" element={<GoogleAuthWrapper />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />

                  <Route path="/video/:videoId" element={<PrivateRoute element={<Player />} />} />
                  <Route path="/presentations/:id" element={<PrivateRoute element={<PresentationPage />} />} />


                  <Route element={<MainLayout />}>

                    <Route path="/profile" element={<PrivateRoute element={<UserProfilePage />} />} />

                    <Route path="/for-me" element={<PrivateRoute element={<DashboardPage />} />} />

                    <Route path="/search" element={<PrivateRoute element={<SearchResultPage />} />} />

                    <Route path="/roadmaps" element={<PrivateRoute element={<RoadmapPage />} />} />
                    <Route path="/roadmap/:id" element={<PrivateRoute element={<RoadmapContentPage />} />} />

                    <Route path="/creator" element={<PrivateRoute element={<CreatorPage />} />} />

                    <Route path="/coming-soon" element={<ComingSoonPage />} />

                    <Route path="/notes" element={<PrivateRoute element={<ComingSoonPage />} />} />
                    <Route path="/practice" element={<PrivateRoute element={<ComingSoonPage />} />} />
                    <Route path="/resources" element={<PrivateRoute element={<ComingSoonPage />} />} />
                    <Route path="/community" element={<PrivateRoute element={<ComingSoonPage />} />} />
                  </Route>
            </Routes>
          </SidebarProvider>
          </SearchProvider>
          </CodeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
