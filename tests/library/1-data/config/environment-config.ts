export const ENV = {
    BASE_URL: process.env.EP_BASE_URL || "https://stg.nas-internal.com",
    LOGIN_URL : process.env.EP_BASE_URL_LOGIN || 'https://stg.nas-internal.com/login',
    PATHS: {
        HOME: "/home",
        MY_APPLICATION: "/web/epapp/my-application",
        DASHBOARD: "/web/epapp/dashboard",
    },
    LANGUAGE: "en_US",
    POST_LOGIN_WAIT_STATE: "networkidle" as const,
};

export function buildUrl(path: string): string {
    return `${ENV.BASE_URL}${path}`;
}