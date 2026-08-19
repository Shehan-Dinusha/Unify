import api from './api';

export const createModule = async (data) => {
  const response = await api.post('/learning/modules', data);
  return response.data;
};

export const getModuleDetails = async (id, degreeId) => {
  const response = await api.get(`/learning/modules/${id}`, { params: { degreeId } });
  return response.data;
};

export const editModuleDetails = async (id, data) => {
  const response = await api.put(`/learning/modules/${id}`, data);
  return response.data;
};

export const deleteModule = async (id) => {
  const response = await api.delete(`/learning/modules/${id}`);
  return response.data;
};

export const createModuleCategory = async (moduleId, data) => {
  const response = await api.post(`/learning/modules/${moduleId}/categories`, data);
  return response.data;
};

export const getModuleCategories = async (moduleId) => {
  const response = await api.get(`/learning/modules/${moduleId}/categories`);
  return response.data;
};

export const updateModuleCategory = async (categoryId, data) => {
  const response = await api.put(`/learning/categories/${categoryId}`, data);
  return response.data;
};

export const deleteModuleCategory = async (categoryId) => {
  const response = await api.delete(`/learning/categories/${categoryId}`);
  return response.data;
};

export const uploadMaterial = async (moduleId, formData, { onUploadProgress } = {}) => {
  const response = await api.post(`/learning/modules/${moduleId}/materials`, formData, {
    onUploadProgress,
  });
  return response.data;
};

export const editMaterial = async (materialId, data) => {
  const response = await api.put(`/learning/materials/${materialId}`, data);
  return response.data;
};

export const deleteMaterial = async (materialId) => {
  const response = await api.delete(`/learning/materials/${materialId}`);
  return response.data;
};

export const getMaterialsByCategory = async (moduleId, categoryId) => {
  const response = await api.get(`/learning/modules/${moduleId}/categories/${categoryId}/materials`);
  return response.data;
};

export const getBatchReps = async (degreeId) => {
  const response = await api.get('/learning/batch-reps', { params: { degreeId } });
  return response.data;
};

export const getSemesterVisibility = async (degreeId, semesterId) => {
  const response = await api.get('/learning/semester-visibility', { params: { degreeId, semesterId } });
  return response.data;
};

export const updateSemesterVisibility = async (degreeId, semesterId, data) => {
  const response = await api.put(`/learning/semester-visibility/${degreeId}/${semesterId}`, data);
  return response.data;
};

export const getBatchRepCourseStructure = async (degreeId) => {
  const response = await api.get('/learning/batch-rep/course-structure', { params: { degreeId } });
  return response.data;
};

export const getStudentCourseStructure = async (userId) => {
  const response = await api.get('/learning/student/course-structure', { params: { userId } });
  return response.data;
};
