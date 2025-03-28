// Mock responses for Google Places API

export const mockGooglePlacesResponse = {
  places: [
    {
      id: "place_id_1",
      displayName: { text: "CN Tower" },
      formattedAddress: "301 Front St W, Toronto, ON M5V 2T6, Canada",
      rating: 4.7,
      photos: [
        {
          name: "places/place_id_1/photos/photo_id_1",
          widthPx: 1200,
          heightPx: 800,
        },
      ],
      regularOpeningHours: {
        weekdayDescriptions: [
          "Monday: 10:00 AM – 9:00 PM",
          "Tuesday: 10:00 AM – 9:00 PM",
          "Wednesday: 10:00 AM – 9:00 PM",
          "Thursday: 10:00 AM – 9:00 PM",
          "Friday: 10:00 AM – 9:00 PM",
          "Saturday: 10:00 AM – 9:00 PM",
          "Sunday: 10:00 AM – 9:00 PM",
        ],
      },
      websiteUri: "https://www.cntower.ca/",
    },
    {
      id: "place_id_2",
      displayName: { text: "Royal Ontario Museum" },
      formattedAddress: "100 Queens Park, Toronto, ON M5S 2C6, Canada",
      rating: 4.5,
      photos: [
        {
          name: "places/place_id_2/photos/photo_id_2",
          widthPx: 1200,
          heightPx: 800,
        },
      ],
      regularOpeningHours: {
        weekdayDescriptions: [
          "Monday: Closed",
          "Tuesday: 10:00 AM – 5:30 PM",
          "Wednesday: 10:00 AM – 5:30 PM",
          "Thursday: 10:00 AM – 5:30 PM",
          "Friday: 10:00 AM – 8:30 PM",
          "Saturday: 10:00 AM – 5:30 PM",
          "Sunday: 10:00 AM – 5:30 PM",
        ],
      },
      websiteUri: "https://www.rom.on.ca/",
    },
  ],
};

export const mockPlacesApiFunction = jest
  .fn()
  .mockResolvedValue(mockGooglePlacesResponse);
