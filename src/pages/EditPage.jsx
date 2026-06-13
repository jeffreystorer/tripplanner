import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { updateDetail, updateTrip } from "@/services";
import { returnNewCurrentTrip } from "@/utils";
import { AddEdit } from "@/components/screens";
import * as state from "@/store";
import "@/styles/index.css";

export default function EditPage({ page }) {
  let isItinerary = false;
  let addedPage = page;
  if (page.includes("itinerary")) {
    isItinerary = true;
    addedPage = page.substring(9);
  }
  const navigate = useNavigate();
  const userId = useRecoilValue(state.userId);
  const currentTripKey = useRecoilValue(state.currentTripKey);
  const setCurrentTrip = useSetRecoilState(state.currentTrip);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);
  const refreshDetailData = useRecoilRefresher_UNSTABLE(state.detailData(page));
  const refreshItineraryData = useRecoilRefresher_UNSTABLE(state.itineraryData);
  const [data, setData] = useState();
  const { rowIndex } = useParams();
  const detailData = useRecoilValue(state.detailData(page));
  const [loading, setLoading] = useState(true);
  const tripData = useRecoilValue(state.tripData);

  useEffect(() => {
    switch (page) {
      case "trip":
        setData(tripData[rowIndex]);
        break;
      default:
        setData(detailData[rowIndex]);
        break;
    }
    setLoading(false);
  }, [detailData, page, rowIndex, tripData]);

  if (loading) return <h2>Loading...</h2>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (page) {
        case "trip":
          await updateTrip(userId, currentTripKey, data);
          const newCurrentTrip = returnNewCurrentTrip(data);
          setCurrentTrip((prev) => newCurrentTrip);
          refreshTripData();
          refreshDetailData();
          refreshItineraryData();
          break;
        default:
          let newData = structuredClone(data);
          delete newData.key;
          updateDetail(userId, currentTripKey, newData, page, data.key);
          refreshTripData();
          refreshItineraryData();
          refreshDetailData();
          break;
      }
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value ? e.target.value : "";
    if (page === "trip" && name !== "atrip_Name") value = value + "T00:00";
    setData({ ...data, [name]: value });
  };

  function handleCancel() {
    if (isItinerary) {
      navigate("/pages/itinerary");
    } else {
      navigate("/pages/" + page);
    }
  }

  return (
    <AddEdit
      mode={"Edit"}
      data={data}
      page={addedPage}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleCancel={handleCancel}
    />
  );
}
