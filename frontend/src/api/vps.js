import axios from "axios"

export const getVpsList = async () => {
  try {
    const response = await axios.get("/api/vps")
    return response.data
  } catch (error) {
    console.error("Error fetching VPS list:", error)
    return []
  }
}