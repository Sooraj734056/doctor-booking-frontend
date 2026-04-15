const FAVORITES_KEY = "favorite-doctors";

export const getFavoriteDoctorIds = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
};

export const isDoctorFavorite = (doctorId) => {
  return getFavoriteDoctorIds().includes(doctorId);
};

export const toggleDoctorFavorite = (doctorId) => {
  const current = getFavoriteDoctorIds();
  const next = current.includes(doctorId)
    ? current.filter((id) => id !== doctorId)
    : [...current, doctorId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
};

export const getFavoriteDoctors = (doctors = []) => {
  const favorites = new Set(getFavoriteDoctorIds());
  return doctors.filter((doctor) => favorites.has(doctor._id));
};
