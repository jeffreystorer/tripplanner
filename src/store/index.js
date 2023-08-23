import { atom, selector, selectorFamily } from "recoil";
import { getDetails, getTrip, getTrips } from "@/services";
import { stayDates, tripDates } from "@/utils";

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const tripData = selector({
  key: "tripData",
  get: async ({ get }) => {
    const response = await getTrips(get(userId));
    if (response.error) {
      throw response.error;
    }
    let tripsArray = [];
    for (const [key, value] of Object.entries(response)) {
      tripsArray.push({
        key: key,
        atrip_Name: value.atrip_Name,
        bstart_Date: value.bstart_Date,
        cend_Date: value.cend_Date,
        details: value.details,
      });
    }
    tripsArray.sort((a, b) => (a.atrip_Name > b.atrip_Name ? 1 : -1));
    return tripsArray;
  },
});

export const currentTripData = selector({
  key: "currentTripData",
  get: async ({ get }) => {
    const response = await getTrip(get(userId), get(currentTripKey));
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

export const detailData = selectorFamily({
  key: "detailData",
  get:
    (page) =>
    async ({ get }) => {
      const response = await getDetails(get(userId), get(currentTripKey), page);
      if (response.error) {
        throw response.error;
      }
      let detailArray = [];
      for (const [key, value] of Object.entries(response)) {
        let detailObject = value;
        detailObject.key = key;
        detailArray.push(detailObject);
      }
      if (detailArray.length > 0) {
        switch (page) {
          case "activity":
            detailArray.sort(function (a, b) {
              let x = a.astart_Date.toLowerCase();
              let y = b.astart_Date.toLowerCase();
              if (x < y) {
                return -1;
              }
              if (x > y) {
                return 1;
              }
              return 0;
            });
            break;
          case "car":
            detailArray.sort((a, b) => {
              const result = a.astart.localeCompare(b.astart);
              return result !== 0 ? result : a.bend.localeCompare(b.bend);
            });
            break;
          case "note":
            break;
          case "room":
            detailArray.sort((a, b) => {
              const result = a.astart_Date.localeCompare(b.astart_Date);
              return result !== 0
                ? result
                : a.bend_Date.localeCompare(b.bend_Date);
            });
            break;
          case "transport":
            detailArray.sort((a, b) => {
              const result = a.astart.localeCompare(b.astart);
              return result !== 0 ? result : a.bend.localeCompare(b.bend);
            });
            break;
          default:
            break;
        }
      }
      return detailArray;
    },
});

export const itineraryDateTime = atom({
  key: "itineraryDateTime",
  default: "",
});

export const itineraryData = selector({
  key: "itineraryData",
  get: async ({ get }) => {
    const response = await getTrip(get(userId), get(currentTripKey));
    if (response.error) {
      throw response.error;
    }
    //dates
    let dateArray = tripDates(response.bstart_Date, response.cend_Date);
    //activities
    let activityArray = [];
    if (response.details.activity) {
      for (const [key, value] of Object.entries(response.details.activity)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = "activity";
        activityArray.push(detailObject);
      }
    }
    //cars
    let carArray = [];
    if (response.details.car) {
      for (const [key, value] of Object.entries(response.details.car)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = "car";
        carArray.push(detailObject);
      }
    }
    //notes
    let noteArray = [];
    if (response.details.note) {
      for (const [key, value] of Object.entries(response.details.note)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = "note";
        noteArray.push(detailObject);
      }
    }
    //rooms
    let roomArray = [];
    if (response.details.room) {
      for (const [key, value] of Object.entries(response.details.room)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = "room";
        detailObject.fstay_Dates = stayDates(
          detailObject.astart_Date,
          detailObject.bend_Date
        );
        roomArray.push(detailObject);
      }
    }
    //transports
    let transportArray = [];
    if (response.details.transport) {
      for (const [key, value] of Object.entries(response.details.transport)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = "transport";
        detailObject.dovernight_Arrival_Date = "";
        if (
          detailObject.astart.substring(0, 10) !==
          detailObject.bend.substring(0, 10)
        ) {
          detailObject.dovernight_Arrival_Date = detailObject.bend.substring(
            0,
            10
          );
        }
        transportArray.push(detailObject);
      }
    }
    return {
      dates: dateArray,
      activities: activityArray,
      cars: carArray,
      notes: noteArray,
      rooms: roomArray,
      transports: transportArray,
    };
  },
});

export const itineraryDetail = atom({
  key: "itineraryDetail",
  default: {},
});

export const userId = atom({
  key: "userId",
  default: null,
  effects: [localStorageEffect("userId")],
});

export const currentTrip = atom({
  key: "currentTrip",
  default: "",
});

export const currentKey = atom({ key: "currentKey", default: "" });

export const currentTripKey = atom({
  key: "currentTripKey",
  default: "",
  effects: [localStorageEffect("currentTripKey")],
});

export const currentTripIndex = atom({
  key: "currentTripIndex",
  default: -1,
});

export const deleteAll = atom({ key: "deleteAll", default: false });

export const deleteTarget = atom({ key: "deleteTarget", default: "" });

export const page = atom({ key: "page", default: "" });

export const showModal = atom({ key: "showModal", default: false });
