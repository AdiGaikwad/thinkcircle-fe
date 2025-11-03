

interface Domains {

    API_HOST: string;
    AUTH_HOST: string;
    SOCKET_HOST: string;


}

const domains: Domains = {
    AUTH_HOST: process.env.NODE_ENV === "production" ? "https://thinkcircle-v0-auth.dhupkar.in" : "http://localhost:3500",
    SOCKET_HOST: process.env.NODE_ENV === "production" ? "https://thinkcircle-v0-auth.dhupkar.in" : "http://localhost:3500",
    API_HOST: ""

}

export default domains