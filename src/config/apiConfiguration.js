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

    userData: `${API_BASE_URL}/api/user/userdata`,

    savedData: {
        saveNote: `${API_BASE_URL}/api/user/save-note`,
        unsaveNote: `${API_BASE_URL}/api/user/unsave-note`,
        savePyq: `${API_BASE_URL}/api/user/save-pyq`,
        unsavePyq: `${API_BASE_URL}/api/user/unsave-pyq`,
        savedCollection: `${API_BASE_URL}/api/user/saved-purchased`,
    },

    addPoints: `${API_BASE_URL}/api/user/add-points`,

    userRedumption: `${API_BASE_URL}/api/user/redeempoints`,

    college: `${API_BASE_URL}/api/colleges`,

    community: `${API_BASE_URL}/api/community/posts`,

    contactus: `${API_BASE_URL}/api/contactus`,

    courses: `${API_BASE_URL}/api/resource/courses`,

    branches: `${API_BASE_URL}/api/resource/branches`,

    subjects: `${API_BASE_URL}/api/resource/subjects`,

    subjectNotes: `${API_BASE_URL}/api/notes`,

    newPyqs: `${API_BASE_URL}/api/newpyq`,

    getOpportunity: `${API_BASE_URL}/api/opportunity/getopportunities`,

    giveOpportunity: `${API_BASE_URL}/api/opportunity/giveopportunities`,

    pyq: `${API_BASE_URL}/api/pyqs`,

    group: `${API_BASE_URL}/api/whatsappgroup`,

    senior: `${API_BASE_URL}/api/seniors`,

    store: `${API_BASE_URL}/api/store`,

    requestPyq: `${API_BASE_URL}/api/pyqs/request-pyq`,

    presignedUrl: `${API_BASE_URL}/api/generate/presigned-url`,

    getSignedUrl: `${API_BASE_URL}/api/get-signed-url`,

    leaderboard: `${API_BASE_URL}/api/user/leaderboard`,

    lostfound: `${API_BASE_URL}/api/lostfound`,
};
