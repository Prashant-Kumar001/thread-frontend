import {
    Avatar,
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    CircularProgress,
    Link as MuiLink,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useGetMyRepliesQuery } from "../../redux/services/api/thread";
import { formatDistanceToNow } from "date-fns";

const Empty = ({ children }) => (
  <Stack alignItems="center" mt={4}>
    <Typography color="text.secondary">{children}</Typography>
  </Stack>
);


const Replies = () => {
    const { username = "" } = useParams();

    const { data, isLoading, isError, error } = useGetMyRepliesQuery({
        username,
        page: 1,
        limit: 10,
    }, {
        skip: !username,
    });

    if (isLoading) {
        return (
            <Stack alignItems="center" mt={5}>
                <CircularProgress />
            </Stack>
        );
    } 

    if (isError) {
        return (
            <Typography color="error" mt={4}>
                {error?.data?.message || "Something went wrong"}
            </Typography>
        );
    }

    const replies = data?.replies || [];

    return (
        <Stack spacing={2} mb={10}>
            {replies.length === 0 ? (
                <Empty>No replies yet.</Empty>
            ) : (
                replies.map((reply) => (
                    <Card
                        key={reply._id}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                            transition: "0.2s",
                            "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            },
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="caption"  >
                                    your reply  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </Typography>
                            </Stack>

                            <Box mt={1.5} ml={5}>
                                <Typography variant="body1">{reply.content}</Typography>
                            </Box>

                            {reply.parent && (
                                <Box
                                    mt={2}
                                    ml={5}
                                    p={1.5}
                                    bgcolor="background.default"
                                    borderRadius={1}
                                    border="1px solid"
                                    borderColor="divider"
                                >
                                    <Link to={`/${reply.parent?.author?.username}`} >
                                        <Typography variant="caption" color="text.secondary">
                                            In reply to @{reply.parent?.author?.username} {" "}
                                            <strong>{reply.parent?.author?.displayName}</strong>
                                        </Typography>
                                    </Link>
                                    <Link to={`/${reply.parent?.author?.username}/${reply.parent?._id}`} >
                                        <Typography
                                            sx={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}
                                            color="text.primary"
                                            variant="body2"
                                            mt={0.5}
                                        >
                                            {reply.parent?.content}
                                        </Typography>
                                    </Link>
                                    <Typography variant="caption" color="text.secondary" mt={0.5}>
                                        {formatDistanceToNow(new Date(reply.parent?.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </Stack>
    );
};

export default Replies;
