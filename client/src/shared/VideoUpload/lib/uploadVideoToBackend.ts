export const uploadVideoToBackend = async (file: File, id: string) => {
  const formData = new FormData();
  formData.append("video", file, id);

  const res = await fetch("http://localhost:4000/api/import", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.ok) console.error("Backend Video Upload Failed");
};
