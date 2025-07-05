import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    useGetOneThreadQuery,
    useGetThreadRepliesQuery,
    useReplyThreadMutation
} from '../redux/services/api/thread';
import {
    Box, Typography, Divider, Button, CircularProgress
} from '@mui/material';

import ThreadCard from '../components/home/ThreadCard';
import ReplyModal from '../components/model/ReplyModal'

const ThreadDetailView = () => {
    const { threadId } = useParams();
    const [page, setPage] = useState(1);
    const [allReplies, setAllReplies] = useState([]);
    const [selectedThread, setSelectedThread] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    const [replyThread, { isLoading }] = useReplyThreadMutation();

    const {
        data: threadData,
        isLoading: isThreadLoading,
        isError: isThreadError,
    } = useGetOneThreadQuery({ id: threadId }, { skip: !threadId });

    const {
        data: repliesData,
        isLoading: isRepliesLoading,
        isFetching: isRepliesFetching,
        isError: isRepliesError,
    } = useGetThreadRepliesQuery({ id: threadId, page, limit: 20 }, { skip: !threadId });

    const thread = threadData?.thread;



    useEffect(() => {
        if (repliesData?.replies?.length > 0) {
            setAllReplies((prev) => {
                const ids = new Set(prev.map((r) => r._id));
                const newReplies = repliesData.replies.filter((r) => !ids.has(r._id));

                return repliesData.currentPage === 1
                    ? repliesData.replies
                    : [...prev, ...newReplies];
            });
        }
    }, [repliesData]);


    const handleReplyClick = (thread) => setSelectedThread(thread);
    const handleCloseModal = () => {
        setReplyContent('');
        setSelectedThread(null);
    };

    const handleSubmitReply = () => {
        if (replyContent) {
            try {
                replyThread({
                    parent: selectedThread._id,
                    content: replyContent,
                    threadType: 'reply',
                }).unwrap();
            } catch (error) {
                console.error('Error replying to thread:', error);
            }
        }
        handleCloseModal();
    };

    if (isThreadLoading || isRepliesLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
        );
    }

    if (isThreadError || isRepliesError) {
        return (
            <Box mt={4} textAlign="center">
                <Typography color="error">Failed to load thread or replies.</Typography>
            </Box>
        );
    }

    return (
        <Box maxWidth="600px" mx="auto" px={2} py={3} mb={10}>
            <ThreadCard thread={thread} onReplyClick={handleReplyClick} />

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Replies ({thread.replyCount})
            </Typography>

            {allReplies.length > 0 ? (
                allReplies.map((reply) => (
                    <ThreadCard
                        key={reply._id}
                        thread={reply}
                        onReplyClick={handleReplyClick}
                        isReply
                    />
                ))
            ) : (
                <Typography variant="body2" color="text.secondary">
                    No replies yet.
                </Typography>
            )}

            {repliesData?.currentPage < repliesData?.totalPages && (
                <Box textAlign="center" mt={2}>
                    <Button
                        variant="outlined"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={isRepliesFetching}
                    >
                        {isRepliesFetching ? 'Loading...' : 'Load more replies'}
                    </Button>
                </Box>
            )}

            <ReplyModal
                open={!!selectedThread}
                onClose={handleCloseModal}
                onSubmit={handleSubmitReply}
                value={replyContent}
                setValue={setReplyContent}
                replyingTo={selectedThread}
            />
        </Box>
    );
};

export default ThreadDetailView;
