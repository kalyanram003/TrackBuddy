export const VALID_STATUSES = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  MISSED: 'MISSED'
};


export const isValidStatus = (status) => {
  if (!status) return false;
  return Object.values(VALID_STATUSES).includes(status.toUpperCase());
};


export const normalizeStatus = (status) => {
  if (!status) return null;
  
  const upperStatus = status.toUpperCase().trim();
  
  if (Object.values(VALID_STATUSES).includes(upperStatus)) {
    return upperStatus;
  }
  
  if (upperStatus === 'COMPLETED') {
    return VALID_STATUSES.DONE;
  }
  
  return null;
};


export const getStatusLabel = (status) => {
  const normalized = normalizeStatus(status);
  const labels = {
    [VALID_STATUSES.PENDING]: 'Pending',
    [VALID_STATUSES.IN_PROGRESS]: 'In Progress',
    [VALID_STATUSES.DONE]: 'Completed',
    [VALID_STATUSES.MISSED]: 'Missed'
  };
  return labels[normalized] || 'Unknown';
};


export const getStatusColor = (status) => {
  const normalized = normalizeStatus(status);
  const colors = {
    [VALID_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    [VALID_STATUSES.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border border-blue-200',
    [VALID_STATUSES.DONE]: 'bg-green-100 text-green-800 border border-green-200',
    [VALID_STATUSES.MISSED]: 'bg-red-100 text-red-800 border border-red-200'
  };
  return colors[normalized] || 'bg-gray-100 text-gray-800 border border-gray-200';
};


export const validateStatus = (status) => {
  const normalized = normalizeStatus(status);
  if (!normalized) {
    throw new Error(
      `Invalid status: "${status}". Valid statuses are: PENDING, IN_PROGRESS, DONE, MISSED`
    );
  }
  return normalized;
};

export default {
  VALID_STATUSES,
  isValidStatus,
  normalizeStatus,
  getStatusLabel,
  getStatusColor,
  validateStatus
};
