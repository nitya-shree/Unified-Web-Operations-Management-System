import React from 'react';

const StatusBadge = ({ status }) => {
  const map = {
    Pending: 'status-badge-pending',
    'In Progress': 'status-badge-inprogress',
    Resolved: 'status-badge-resolved',
  };
  return <span className={map[status] || 'status-badge-pending'}>{status}</span>;
};

export default StatusBadge;