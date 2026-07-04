let jobPhotos = [];

export function addJobPhoto(dataUrl) {
  jobPhotos.push(dataUrl);
}

export function getJobPhotos() {
  return jobPhotos;
}

export function clearJobPhotos() {
  jobPhotos = [];
}