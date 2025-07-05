import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const PostMedia = ({ media = [], threadId }) => {
  if (!media.length) return null;

  const isSingle = media.length === 1;

  return (
    <Box
      mt={1.5}
      display="grid"
      gap={1}
      borderRadius={2}
      overflow="hidden"
      width="100%"
      gridTemplateColumns={{
        xs: '1fr',
        sm: isSingle ? '1fr' : 'repeat(2, 1fr)',
        md: isSingle ? '1fr' : 'repeat(3, 1fr)',
      }}
    >
      {media.map((item, idx) => {
        const isVideo = item.secure_url?.match(/\.(mp4|webm)$/i);

        return (
          <Box
            key={idx}
            component={Link}
            target="_blank"
            to={item.secure_url}
            sx={{
              display: 'block',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
              position: 'relative',
            }}
            aria-label={`View media ${idx + 1}`}
          >
            {isVideo ? (
              <Box
                component="video"
                src={item.secure_url}
                controls
                muted
                playsInline
                preload="metadata"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  backgroundColor: '#000',
                }}
              />
            ) : (
              <Box
                component="img"
                src={item.secure_url}
                alt={`Media ${idx + 1}`}
                loading="lazy"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  borderRadius: 2,
                  display: 'block',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default PostMedia;
