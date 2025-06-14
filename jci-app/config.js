export const API_BASE_URL = 'https://jci-mobile-app.onrender.com';

export const API_ENDPOINTS = {
    USER_REGISTER: `${API_BASE_URL}/api/users/register`,
    USER_LOGIN: `${API_BASE_URL}/api/users/login`,
    USER_PROFILE_PICTURE: (userId) => `${API_BASE_URL}/api/users/${userId}/profile-picture`,
    USER_REQUEST_UPDATE: `${API_BASE_URL}/api/users/request-update`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
    ADMIN_TOTAL_USERS: `${API_BASE_URL}/api/admin/total-users`,
    ADMIN_ALL_USERS: `${API_BASE_URL}/api/admin/all-users`,
    ADMIN_PENDING_USERS: `${API_BASE_URL}/api/admin/pending-users`,
    ADMIN_APPROVE_USER: (userId) => `${API_BASE_URL}/api/admin/approve-user/${userId}`,
    ADMIN_REJECT_USER: (userId) => `${API_BASE_URL}/api/admin/reject-user/${userId}`,
    ADMIN_UPDATE_REQUESTS: `${API_BASE_URL}/api/admin/update-requests`,
    ADMIN_APPROVE_UPDATE: (requestId) => `${API_BASE_URL}/api/admin/approve-update/${requestId}`,
    ADMIN_REJECT_UPDATE: (requestId) => `${API_BASE_URL}/api/admin/reject-update/${requestId}`,
    IMAGES_UPLOAD: `${API_BASE_URL}/api/images/upload`,
    IMAGES_GET: `${API_BASE_URL}/api/images`,
    APPROVED_USERS: `${API_BASE_URL}/api/users/approved`
};
