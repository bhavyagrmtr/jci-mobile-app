export const API_BASE_URL = 'http://192.168.1.8:5000';

export const API_ENDPOINTS = {
    USER_REGISTER: `${API_BASE_URL}/api/users/register`,
    USER_LOGIN: `${API_BASE_URL}/api/users/login`,
    USER_PROFILE_PICTURE: (userId) => `${API_BASE_URL}/api/users/${userId}/profile-picture`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
    ADMIN_PENDING_USERS: `${API_BASE_URL}/api/admin/pending-users`,
    ADMIN_APPROVE_USER: (userId) => `${API_BASE_URL}/api/admin/approve-user/${userId}`,
    ADMIN_REJECT_USER: (userId) => `${API_BASE_URL}/api/admin/reject-user/${userId}`,
    IMAGES_UPLOAD: `${API_BASE_URL}/api/images/upload`,
    IMAGES_GET: `${API_BASE_URL}/api/images`
}; 