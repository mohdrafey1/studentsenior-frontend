export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;
export const API_KEY_URL = import.meta.env.VITE_API_KEY_URL;

export const api = {
    auth: {
        login: `${API_BASE_URL}/api/auth/signin`,
        signup: `${API_BASE_URL}/api/auth/signup`,
        google: `${API_BASE_URL}/api/auth/google`,
        signout: `${API_BASE_URL}/api/auth/signout`,
    },

    user: `${API_BASE_URL}/api/user/update`,

    college: `${API_BASE_URL}/api/colleges`,

    community: `${API_BASE_URL}/api/community/posts`,

    contactus: `${API_BASE_URL}/api/contactus`,

    courses: `${API_BASE_URL}/api/resource/courses`,

    branches: `${API_BASE_URL}/api/resource/branches`,

    subjects: `${API_BASE_URL}/api/resource/subjects`,

    subjectNotes: `${API_BASE_URL}/api/notes`,

    getOpportunity: `${API_BASE_URL}/api/opportunity/getopportunities`,

    giveOpportunity: `${API_BASE_URL}/api/opportunity/giveopportunities`,

    pyq: `${API_BASE_URL}/api/pyqs`,

    group: `${API_BASE_URL}/api/whatsappgroup`,

    senior: `${API_BASE_URL}/api/seniors`,

    store: `${API_BASE_URL}/api/store`,

    requestPyq: `${API_BASE_URL}/api/pyqs/request-pyq`,
};
