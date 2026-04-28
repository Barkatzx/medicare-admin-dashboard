// src/store/slices/notificationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, User } from "@/config/api";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  users: User[];
  unreadCount: number;
  loading: boolean;
  sending: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  users: [],
  unreadCount: 0,
  loading: false,
  sending: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async () => {
    const response = await api.getNotifications();
    return response;
  },
);

export const fetchUsersForNotification = createAsyncThunk(
  "notifications/fetchUsers",
  async () => {
    const data = await api.getUsers();
    return Array.isArray(data)
      ? data.filter((user: User) => user.isApproved === true)
      : [];
  },
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      // Call the API - the endpoint is PUT /api/users/notifications/{notificationId}
      await api.markNotificationAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to mark as read");
    }
  },
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.markAllNotificationsAsRead();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to mark all as read");
    }
  },
);

export const sendNotification = createAsyncThunk(
  "notifications/send",
  async (notificationData: {
    userId: string;
    title: string;
    message: string;
    type: string;
  }) => {
    await api.sendNotification(notificationData);
    return notificationData;
  },
);

export const sendBulkNotifications = createAsyncThunk(
  "notifications/sendBulk",
  async (notificationData: {
    userIds: string[];
    title: string;
    message: string;
    type: string;
  }) => {
    await api.sendBulkNotifications(notificationData);
    return notificationData;
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationState: (state) => {
      state.error = null;
      state.sending = false;
    },
    // Optimistic update for marking as read
    optimisticMarkAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId,
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload?.notifications || [];
        state.unreadCount = action.payload?.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
        toast.error("Failed to load notifications");
      })
      // Fetch Users
      .addCase(fetchUsersForNotification.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchUsersForNotification.rejected, (state, action) => {
        toast.error(action.error.message || "Failed to load users");
      })
      // Mark as Read
      .addCase(markNotificationAsRead.pending, (state, action) => {
        // Optimistic update - mark as read immediately
        const notificationId = action.meta.arg;
        const notification = state.notifications.find(
          (n) => n.id === notificationId,
        );
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        // Already updated optimistically, just show success toast
        toast.success("Marked as read");
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        // Revert optimistic update on error
        const notificationId = action.meta.arg;
        const notification = state.notifications.find(
          (n) => n.id === notificationId,
        );
        if (notification && notification.isRead) {
          notification.isRead = false;
          state.unreadCount = state.unreadCount + 1;
        }
        toast.error((action.payload as string) || "Failed to mark as read");
      })
      // Mark All as Read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        // Optimistic update - mark all as read
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        toast.success("All notifications marked as read");
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        // Revert on error - need to refetch
        toast.error((action.payload as string) || "Failed to mark all as read");
      })
      // Send Notification
      .addCase(sendNotification.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendNotification.fulfilled, (state) => {
        state.sending = false;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.sending = false;
        toast.error(action.error.message || "Failed to send notification");
      })
      // Send Bulk Notifications
      .addCase(sendBulkNotifications.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendBulkNotifications.fulfilled, (state) => {
        state.sending = false;
      })
      .addCase(sendBulkNotifications.rejected, (state, action) => {
        state.sending = false;
        toast.error(action.error.message || "Failed to send notifications");
      });
  },
});

export const { clearNotificationState, optimisticMarkAsRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
