const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const { body, method = 'POST' } = options;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export function checkParticipant(studentId) {
  return request('/api/check', { body: { studentId } });
}

export function registerParticipant(participant) {
  return request('/api/register', { body: participant });
}

export function logAttendanceLogin(studentId) {
  return request('/api/login', { body: { studentId } });
}

export function logAttendanceLogout(studentId) {
  return request('/api/logout', { body: { studentId } });
}

export function getAttendanceRecords(type = '') {
  const query = type ? `?type=${encodeURIComponent(type)}` : '';
  return request(`/api/attendance${query}`, { method: 'GET' });
}
