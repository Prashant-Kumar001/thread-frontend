import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Tooltip,
  Badge,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { CgClose } from 'react-icons/cg';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import {
  useGetFollowsQuery,
  useLikeProfileMutation,
} from '../../redux/services/auth/profile';
import { useSelector } from 'react-redux';

const ShowFollowers = ({ open, onClose, type, currentUser }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetFollowsQuery(
    {
      username: currentUser,
      type,
      page: 1,
      limit: 10,
    },
    {
      skip: !currentUser,
    }
  );

  const follows = data?.[type] || [];
  const isOwnProfile = user?.username === currentUser;
  const [likeProfile] = useLikeProfileMutation();

  const toggleLike = async (username) => {
    try {
      await likeProfile({ username });
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="followers-dialog-title"
    >
      <DialogTitle
        id="followers-dialog-title"
        sx={{
          fontSize: '1.25rem',
          fontWeight: 500,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {type === 'followers' ? 'Followers' : 'Following'}
        <IconButton aria-label="close" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CgClose size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ padding: '12px', bgcolor: theme.palette.menuBackground }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
            <CircularProgress size={32} />
          </Box>
        ) : isError ? (
          <Typography sx={{ textAlign: 'center', color: '#d32f2f', padding: '16px' }}>
            Failed to load {type}.
          </Typography>
        ) : follows.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#666', padding: '16px' }}>
            No {type} yet.
          </Typography>
        ) : (
          <List sx={{ padding: 0 }}>
            {follows.map((item) => (
              <ListItem
                key={item._id}
                sx={{
                  padding: '12px 16px',
                  bgcolor: 'Background.default',
                }}
                secondaryAction={
                  isOwnProfile && (
                    <Tooltip title={item?.likedByMe ? 'Unlike' : 'Like'}>
                      <IconButton
                        onClick={() => toggleLike(item.username)}
                        aria-label={item?.likedByMe ? 'Unlike profile' : 'Like profile'}
                      >
                        {item?.likedByMe ? (
                          <AiFillHeart size={20} color="#d32f2f" />
                        ) : (
                          <AiOutlineHeart size={20} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      isOwnProfile && item.likedMe ? (
                        <AiFillHeart size={12} color="#d32f2f" />
                      ) : null
                    }
                  >
                    <Avatar
                      src={item.avatar?.secure_url}
                      alt={item.username}
                      sx={{ width: 40, height: 40 }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                      {item.displayName}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      @{item.username}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShowFollowers;
