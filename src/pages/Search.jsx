import React, { useEffect, useState } from "react";
import SearchInput from "../components/search/SearchInput";
import SearchProfile from "../components/search/SearchProfile";
import {
  Stack,
  Typography,
  Skeleton,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useSearchProfilesQuery } from "../redux/services/auth/profile";
import { AnimatePresence, motion } from "framer-motion";

const SKELETON_COUNT = 2;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const {
    data,
    isFetching,
    isError,
  } = useSearchProfilesQuery(debouncedSearchTerm, {
    skip: debouncedSearchTerm.trim() === "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const profiles = data?.profiles || [];




  return (
    <>
      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <Stack
        direction="column"
        gap={2}
        mb={10}
        sx={{
          width: "100%",
          maxWidth: 750,
          mx: "auto",
          p: 2,
        }}
      >
          {isFetching && debouncedSearchTerm && (
            <Stack alignItems="center" mt={5}>
              <CircularProgress />
            </Stack>
          )}

        {isError && (
          <Fade in timeout={300}>
            <Typography color="error" textAlign="center">
              Failed to load profiles.
            </Typography>
          </Fade>
        )}

        {!isFetching && debouncedSearchTerm && profiles.length === 0 && (
          <Fade in timeout={300}>
            <Typography textAlign="center">No profiles found.</Typography>
          </Fade>
        )}

        {!debouncedSearchTerm && !isFetching && (
          <Fade in timeout={300}>
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
              sx={{ mt: 4 }}
            >
              Start typing to search profiles…
            </Typography>
          </Fade>
        )}

        <AnimatePresence>
          {profiles.map((profile) => (
            <motion.div
              key={profile.username}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <SearchProfile profile={profile} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>
    </>
  );
};

export default Search;
