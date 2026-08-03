import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { AddEdit } from "@/components/screens";
import { updateDetail } from "@/services";
import * as state from "@/store";
import "@/styles/index.css";

export default function EditDetailPage({ type }) {
  const navigate = useNavigate();
  const detail = useRecoilValue(state.itineraryDetail);
  const tripData = useRecoilValue(state.tripData);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const userId = useRecoilValue(state.userId);
  const currentTripKey = useRecoilValue(state.currentTripKey);
  const currentTripIndex = useRecoilValue(state.currentTripIndex);
  const refreshItineraryData = useRecoilRefresher_UNSTABLE(state.itineraryData);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);
  const setCurrentKey = useSetRecoilState(state.currentKey);
  const setDeleteAll = useSetRecoilState(state.deleteAll);
  const setDeleteTarget = useSetRecoilState(state.deleteTarget);
  const setShowModal = useSetRecoilState(state.showModal);
  const setPage = useSetRecoilState(state.page);
  const deleteTarget = type === "itinerary" ? "itinerarydetail" : "detail";
  const path =
    type === "itinerary" ? "/pages/itinerary" : `/pages/${detail.page}`;

  useEffect(() => {
    setData(tripData[currentTripIndex].details[detail.page][detail.key]);
    setLoading(false);
  }, [currentTripIndex, detail.key, detail.page, tripData]);

  useEffect(() => {
    refreshTripData();
    refreshItineraryData();
  }, [refreshItineraryData, refreshTripData]);

  const handleChange = (e) => {
    let newValue = e.target.value;
    if (!newValue) newValue = "";
    setData({ ...data, [e.target.name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newData = structuredClone(data);
      delete newData.key;
      await updateDetail(userId, currentTripKey, newData, detail.page, detail.key);
      refreshItineraryData();
      refreshTripData();
      navigate(path);
    } catch (error) {
      console.log(error);
    }
  };

  //mirrors DetailPage.handleDelete so both routes feed the same confirm modal.
  //ConfirmDeleteModal reads the page atom for its detailData refresher and, on
  //the 'detail' branch, for the record path - so set it here too.
  const handleDelete = (e) => {
    e.preventDefault();
    setPage(detail.page);
    setCurrentKey(detail.key);
    setDeleteAll(false);
    setDeleteTarget(deleteTarget);
    setShowModal(true);
    navigate("/pages/confirmdelete");
  };

  const handleCancel = () => {
    navigate(path);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <AddEdit
      mode={"Edit"}
      page={detail.page}
      data={data}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleCancel={handleCancel}
      handleDelete={detail.page === "map" ? handleDelete : undefined}
    />
  );
}
