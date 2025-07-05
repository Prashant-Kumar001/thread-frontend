import { formatDistanceToNowStrict, format } from 'date-fns';

export const formatRelativeTime = (dateStr) => {
  try {
    return formatDistanceToNowStrict(new Date(dateStr), { addSuffix: true });
  } catch (e) {
    return '';
  }
};

export const formatAbsoluteTime = (dateStr) => {
  try {
    return format(new Date(dateStr), 'dd MMM yyyy, hh:mm a');
  } catch (e) {
    return '';
  }
};
