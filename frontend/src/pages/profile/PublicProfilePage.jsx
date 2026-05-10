import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import StudentPublicView from "../../components/profile/public/StudentPublicView";
import BoardingOwnerPublicView from "../../components/profile/public/BoardingOwnerPublicView";
import ClubPublicView from "../../components/profile/public/ClubPublicView";
import FoodCafePublicView from "../../components/profile/public/FoodCafePublicView";
import SelfEmployedPublicView from "../../components/profile/public/SelfEmployedPublicView";
import { getPublicProfile } from "../../services/profileService";
import postService from "../../services/postService";
import { getCurrentUser } from "../../services/authService";
import { Loader2, Lock } from "lucide-react";
import Button from "../../components/common/Button";

// ------------------------------------------------------------------
// Public view switcher (role of the VISITED profile)
// ------------------------------------------------------------------
const PublicViewSwitch = ({ profile }) => {
  const role = profile?.role || "student";
  switch (role) {
    case "boarding_owner":
      return <BoardingOwnerPublicView profile={profile} />;
    case "club_society":
      return <ClubPublicView profile={profile} />;
    case "food_cafe":
      return <FoodCafePublicView profile={profile} />;
    case "self_employed":
      return <SelfEmployedPublicView profile={profile} />;
    case "student":
    default:
      return <StudentPublicView profile={profile} />;
  }
};

// ------------------------------------------------------------------
// Page component
// ------------------------------------------------------------------
const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsForbidden(false);
        const [profileData, postsData] = await Promise.all([
          getPublicProfile(userId),
          postService.getUserPosts(userId).catch(() => ({ posts: [] }))
        ]);
        
        const profileWithPosts = { ...profileData, posts: postsData.posts || [] };
        
        setProfile(profileWithPosts);
      } catch (err) {
        if (err.includes("not accessible") || err.includes("Forbidden")) {
          setIsForbidden(true);
        } else {
          setError(err.message || err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const currentUser = getCurrentUser();
  const sidebarUser = currentUser
    ? {
        name: currentUser.name,
        role: currentUser.role?.toLowerCase() === "admin" ? "student" : currentUser.role?.toLowerCase(),
        displayRole: currentUser.role,
        avatar: currentUser.avatar,
      }
    : { name: "Guest", role: "student", displayRole: "Guest" };

  if (loading) {
    return (
      <MainLayout user={sidebarUser} pageTitle="Profile" verificationCount={0}>
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (isForbidden) {
    return (
      <MainLayout user={sidebarUser} pageTitle="Profile" verificationCount={0}>
        <div className="w-full max-w-5xl mx-auto px-1 md:px-0 flex flex-col items-center justify-center h-[60vh] text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-state-error/10 flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-state-error" />
          </div>
          <h2 className="text-heading-medium text-white">Access Denied</h2>
          <p className="text-text-secondary max-w-md">
            This profile is not accessible. You do not have the required permissions to view this user's information.
          </p>
          <Button variant="primary" onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout user={sidebarUser} pageTitle="Profile" verificationCount={0}>
        <div className="w-full max-w-5xl mx-auto px-1 md:px-0 flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-text-secondary">{error || "Failed to load profile."}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={sidebarUser} pageTitle={`${profile.name}'s Profile`} verificationCount={0}>
      <div className="w-full max-w-5xl mx-auto px-1 md:px-0">
        <PublicViewSwitch profile={profile} />
      </div>
    </MainLayout>
  );
};

export default PublicProfilePage;
