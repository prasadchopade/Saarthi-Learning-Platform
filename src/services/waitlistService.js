import api from "./api";

export const addToWaitlist = async (email) => {
  const { data } = await api.post("/waitlist/email", { email });
  return data;
};


