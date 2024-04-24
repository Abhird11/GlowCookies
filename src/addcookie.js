const firstText = document.querySelector("#firstText");
const submitBtnExpiring = document.querySelector("#submitBtnExpiring");
const submitBtnSession = document.querySelector("#submitBtnSession");

submitBtnExpiring.addEventListener("click", () => {
    setCookie(firstText.value, firstText.value, 365);
    addExpiringCookieDirectlyForTest(firstText.value, firstText.value, 365);
});

submitBtnSession.addEventListener("click", () => {
    setCookie(firstText.value, firstText.value, 365);
    addSessionCookieDirectlyForTest(firstText.value, firstText.value, 365);
});

// Example to force expiry addition
function addExpiringCookieDirectlyForTest(name, value, days) {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    let cookieString = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/`;
    document.cookie = cookieString;
}

function addSessionCookieDirectlyForTest(name, value, days) {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    let cookieString = `${name}=${value}; path=/`;
    document.cookie = cookieString;
}

function setCookie(name, value, daysToLive) {
    const isSessionOnly = sessionStorage.getItem('isSessionOnly') === 'true';

    let expires = "";
    if (!isSessionOnly && daysToLive !== null) { // If not session-only and daysToLive is specified
        const date = new Date();
        date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
        expires = "expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function deleteCookie(name){
    setCookie(name, null, null);
}
