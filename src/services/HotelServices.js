import apiClient from "./services";

export default {
  getHotels() {
    return apiClient.get("hotels");
  },
  getHotelsByItineraryDayId(itineraryDayId) {
    return apiClient.get("hotels/itineraryday/" + itineraryDayId);
  },
  getHotel(id) {
    return apiClient.get("hotels/" + id);
  },
  addHotel(hotel) {
    return apiClient.post("hotels/", hotel);
  },
  updateHotel(hotelId, hotel) {
    return apiClient.put("hotels/" + hotelId, hotel);
  },
   deleteHotel(hotelId) {
    return apiClient.delete("hotels/" + hotelId);
  },
};
