export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export const getStatusColor = (status) => {
  const colors = { pending: '#f59e0b', confirmed: '#10b981', cancelled: '#ef4444', completed: '#6366f1' };
  return colors[status] || '#6b7280';
};
