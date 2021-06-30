const ACCESS_TOKEN = 'sqilled::accessToken';
const USER_ID = "sqilled::user_Id";
const SEARCH_KEYWORD = "sqilled::searchKeyword";
const SEARCHED_USERID ='sqilled:searchUserid';
const SAVE_URL = 'sqilled:saveUrl';
const BOOKING_ID= 'sqilled:bookingId';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /**
     * Returns if an user is an admin
     *
     * @param { array } roles
     * @returns
     */
    isAdmin(roles) {
        return roles.some((element) => element.name === 'Administrator');
    },

    setAccessToken(accessToken) {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
    },
    getAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN);
    },
    removeAccessToken() {
        localStorage.removeItem(ACCESS_TOKEN);
    },
    setUserID(user_Id) {
        localStorage.setItem(USER_ID, user_Id);
    },
    getUserID() {
        return localStorage.getItem(USER_ID);
    },
    removeUserID() {
        localStorage.removeItem(USER_ID);
    },

    //SEARCH KEYWORD
    setSearchKeyword(searchKeyword) {
        localStorage.setItem(SEARCH_KEYWORD, searchKeyword);
    },
    getSearchKeyword() {
        return localStorage.getItem(SEARCH_KEYWORD);
    },
    removeSearchKeyword() {
        localStorage.removeItem(SEARCH_KEYWORD);
    },

    setSearchedUserId(searchUserid) {
        localStorage.setItem(SEARCHED_USERID, searchUserid);
    },
    getSearchedUserId() {
        return localStorage.getItem(SEARCHED_USERID);
    },
    removeSearchedUserId() {
        localStorage.removeItem(SEARCHED_USERID);
    },
    /**Saved url */

    setSaveUrl(saveUrl){
        localStorage.setItem(SAVE_URL, saveUrl);
    },
    getSaveUrl(){
        return localStorage.getItem(SAVE_URL);
    },
    removeSaveUrl(){
        localStorage.removeItem(SAVE_URL);
    },

    /**Booking Id */
    setBookingId(bookingId){
        localStorage.setItem(BOOKING_ID, bookingId);
    },
    getBookingId(){
        return localStorage.getItem(BOOKING_ID);
    },
    removeBookingId(){
        localStorage.removeItem(BOOKING_ID);
    },


    /* Logout */
    logout() {
        // localStorage.clear();
        /* Autherization */
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(USER_ID);
        localStorage.removeItem(SEARCH_KEYWORD);
        localStorage.removeItem(SEARCHED_USERID);
        localStorage.removeItem(SAVE_URL);
        localStorage.removeItem(BOOKING_ID);
    },
};