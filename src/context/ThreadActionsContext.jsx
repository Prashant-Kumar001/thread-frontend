import { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useCreateThreadMutation, useLikeThreadMutation, useLikeReplyMutation, useDeleteThreadMutation } from "../redux/services/api/thread";
import { toast } from "react-hot-toast";

const ThreadActionsContext = createContext();

export const useThreadActions = () => useContext(ThreadActionsContext);

export const ThreadActionsProvider = ({ children }) => {
  const user = useSelector((state) => state?.auth?.user);

  const [likeThread] = useLikeThreadMutation();
  const [createThread] = useCreateThreadMutation();
  const [likeReply] = useLikeReplyMutation();
  const [deleteThreadMutation] = useDeleteThreadMutation();

  const threadLike = async (threadId) => {
    try {
      await likeThread(threadId).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Like failed.");
    }
  };
  const threadReplyLike = async (replyId) => {
    try {
      await likeReply(replyId).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Like failed.");
    }
  };

  const threadReplies = async (parent, content, type = "reply") => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("threadType", type);
    if (parent) {
      formData.append("parent", parent);
    }
    try {
      await createThread(formData).unwrap();
      toast.success("Comment posted successfully!");
    } catch (error) {
      toast.error(error?.data?.message)
    }
  };
  const threadRetweet = async (threadId, type = 'repost') => {
    const formData = new FormData();
    formData.append("threadType", type);
    formData.append("originalThread", threadId);
    try {
      await createThread(formData).unwrap();
      toast.success("Retweet posted successfully!");
    } catch (error) {
      toast.error(error?.data?.message)
    }
  };

  const deleteThread = async (threadId) => {
    const toastId = toast.loading("Deleting thread...");
    try {
      await deleteThreadMutation(threadId).unwrap();
      toast.success("Thread deleted successfully!");
    } catch (error) {
      toast.error(error?.data?.message)
    } finally {
      toast.dismiss(toastId);
    }

  };


  const send = (user, threadId) => {
    const link = `${window.location.origin}/${user}/${threadId}`;
    navigator.clipboard.writeText(link);
    alert("Post link copied to clipboard!");
  };

  return (
    <ThreadActionsContext.Provider
      value={{
        threadLike,
        threadReplies,
        threadRetweet,
        threadReplyLike,
        deleteThread,
        send,
      }}
    >
      {children}
    </ThreadActionsContext.Provider>
  );
};
