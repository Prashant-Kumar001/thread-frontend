import React, { Fragment, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { FaInstagram } from "react-icons/fa6";
import { Outlet, useParams, NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { VscVerifiedFilled } from "react-icons/vsc";
import { AiFillHeart } from "react-icons/ai";
import { CgEyeAlt } from "react-icons/cg";
import { formatDistanceToNow } from "date-fns";

import EditProfile from "../../components/model/EditProfile";
import ShowFollowers from "../../components/model/ShowFollowers";
import ErrorFallback from "../../components/common/ErrorFallback";
import {
  useFollowToggleMutation,
  useMeQuery,
} from "../../redux/services/auth/profile";
import { setEdit } from "../../redux/features/profileSlice";

const ProfileLayout = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { username = "" } = useParams();
  const { accessToken, user: currentUser } = useSelector((s) => s.auth ?? {});
  const { edit } = useSelector((s) => s.profile ?? {});
  const [showBox, setShowBox] = useState(false);
  const [type, setType] = useState("followers");

  const { data, isLoading, isError, error, refetch } = useMeQuery(username, {
    skip: !accessToken || !username,
  });

  const {
    user,
    mutualFollowersPreview = [],
    mutualFollowersCount = 0,
    youFollowThem,
    theyFollowYou,
    isMutual
  } = data ?? {};


  const [toggleFollow, { isLoading: isToggling }] = useFollowToggleMutation();

  const handleFollow = async () => {
    if (!accessToken) return;
    try {
      await toggleFollow({ username }).unwrap();
    } catch (err) {
      console.error("toggleFollow failed →", err);
      alert("Could not update follow status. Please try again.");
    }
  };

  const handleCloseEdit = () => dispatch(setEdit(false));
  const handlerFollowers = () => {
    setShowBox((prev) => !prev);
    setType("followers");
  };
  const handlerFollowing = () => {
    setShowBox((prev) => !prev);
    setType("following");
  };

  useEffect(() => {
    return () => {
      dispatch(setEdit(false));
      setShowBox(false);
      setType("followers");
    };
  }, []);

  if (!username) return <ErrorFallback msg="No user specified in URL." />;
  if (isLoading)
    return (
      <Stack maxWidth="sm" mx="auto" spacing={2} mt={2}>
        <Box display="flex" justifyContent={"space-between"} gap={2} >
          <Box width="80%" >
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="20%" />
          </Box>
          <Skeleton variant="circular" width={64} height={64} />
        </Box>
        <Skeleton variant="rectangular" height={200} />
      </Stack>
    );

  if (isError)
    return (
      <ErrorFallback
        msg="Failed to load profile."
        details={error?.data?.message ?? error?.statusText}
        onRetry={refetch}
      />
    );

  const isOwner = currentUser?.id === user._id;

  return (
    <Fragment>
      {edit && (
        <EditProfile open={edit} onClose={handleCloseEdit} user={user} />
      )}
      {showBox && (
        <ShowFollowers
          open={showBox}
          onClose={() => setShowBox(false)}
          type={type}
          currentUser={username}
        />
      )}
      <Stack
        maxWidth="750px"
        mx="auto"
        p={{ xs: 2, sm: 3 }}
        spacing={3}
        sx={{ wordBreak: "break-word" }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight="bold">
              {user.username}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">{user.displayName}</Typography>
              {user.verified && (
                <Chip label="Verified" color="success" size="small" />
              )}
            </Stack>
            <Chip
              icon={<AiFillHeart size={16} />}
              label={`${user.likedBy?.length || 0} Profile Likes`}
              color="error"
              variant="outlined"
              size="small"
            />
          </Stack>
          {user.avatar?.secure_url && (
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.avatar.secure_url}
                alt={user.username}
                sx={{ width: 80, height: 80 }}
              />
              {user.isVerified && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 10,
                    backgroundColor: "white",
                    borderRadius: "50%",
                    p: "2px",
                  }}
                >
                  <VscVerifiedFilled size={16} color="#1976d2" />
                </Box>
              )}
            </Box>
          )}
        </Stack>
        <Typography variant="body1" color="text.secondary">
          {user.bio || "No bio"}
        </Typography>
        {user.website && (
          <a
            href={
              user.website.startsWith("http")
                ? user.website
                : `https://${user.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              variant="body2"
              color="primary"
              sx={{ wordBreak: "break-word" }}
            >
              {user.website}
            </Typography>
          </a>
        )}
        {!isOwner && mutualFollowersPreview.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Followed by{" "}
            {mutualFollowersPreview.map((u, i) => (
              <Link key={u._id} to={`/${u.username}`} >
                <strong key={u.username}>
                  {u.displayName || u.username}
                  {i < mutualFollowersPreview.length - 1 ? ", " : ""}
                </strong>
              </Link>
            ))}
            {mutualFollowersCount > mutualFollowersPreview.length &&
              ` and ${mutualFollowersCount - mutualFollowersPreview.length} others`}
          </Typography>
        )}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <Button onClick={handlerFollowers} variant="outlined" size="small">
              {user.followers?.length ?? 0} Followers
            </Button>
            <Button onClick={handlerFollowing} variant="outlined" size="small">
              {user.following?.length ?? 0} Following
            </Button>

            {!isOwner && (
              <Button
                disabled={isToggling}
                onClick={handleFollow}
                variant="contained"
                size="small"
              >
                {user.followers?.includes(currentUser?.id)
                  ? "Unfollow"
                  : "Follow"}
              </Button>
            )}
            <Typography variant="caption" color="text.secondary">
              Joined{" "}
              {formatDistanceToNow(new Date(user.createdAt), {
                addSuffix: true,
              })}
            </Typography>
            {/* <Typography variant="caption" color="text.secondary">
              Last update:{" "}
              {user.updatedAt && formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })}
            </Typography> */}
            {/* <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
              <CgEyeAlt style={{ marginRight: 4 }} /> {user.profileViews}
            </Typography> */}
          </Stack>

          <FaInstagram size={24} color={theme.palette.text.secondary} />
        </Stack>
        {isOwner && (
          <Button
            onClick={() => dispatch(setEdit(true))}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: 2,
              color: "text.secondary",
              borderColor: "divider",
              ":hover": { bgcolor: "primary.main", color: "white" },
            }}
          >
            Edit Profile
          </Button>
        )}

        <Stack
          direction="row"
          justifyContent="space-evenly"
          borderBottom={`1px solid ${theme.palette.divider}`}
          pb={1}
        >
          {["threads", "replies", "repost"].map((tab) => (
            <NavLink
              key={tab}
              to={tab}
              className={({ isActive }) =>
                `link ${isActive ? "active-link" : ""}`
              }
              style={({ isActive }) => ({
                padding: "8px 12px",
                textDecoration: "none",
                fontWeight: 500,
                borderBottom: isActive
                  ? `2px solid ${theme.palette.primary.main}`
                  : "none",
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              })}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </NavLink>
          ))}
        </Stack>
        <Outlet />
      </Stack>
    </Fragment>
  );
};

export default ProfileLayout;
