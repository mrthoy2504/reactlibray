export const URL = "http://localhost:5000"
export const BACK_URL = "http://localhost:5000"

export const config = {
    apiPath: 'http://localhost:5000',
    headers: () => {
        return {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }
    }
}
