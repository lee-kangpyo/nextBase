// Content-Disposition에서 파일명 추출
export function extractFilenameFromDisposition(
  disposition?: string,
  fallback = 'downloaded_file',
) {
  if (!disposition) return fallback;
  const match = disposition.match(/filename[^;=\n]*=((['\"]).*?\2|[^;\n]*)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1].replace(/['\"]/g, ''));
  }
  return fallback;
}

// blob을 받아서 다운로드 트리거
export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
