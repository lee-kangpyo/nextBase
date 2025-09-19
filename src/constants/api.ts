// API 엔드포인트 상수 정의
// 모든 API URL을 중앙에서 관리

// Role 관련 API
export const ROLE_API = {
  LIST: '/admin/roles',
  CREATE: '/admin/roles',
  UPDATE: (roleId: number) => `/admin/roles/${roleId}/update`,
  ADD_RESOURCE: (roleId: number, resourceId: number) =>
    `/admin/roles/${roleId}/resources/${resourceId}`,
  DELETE_RESOURCE: (roleId: number, resourceId: number) =>
    `/admin/roles/${roleId}/resources/${resourceId}/delete`,
  DELETE: (roleId: number) => `/admin/roles/${roleId}/delete`,
  GET: (roleId: number) => `/admin/roles/${roleId}`,
  GET_RESOURCES: (roleId: number) => `/admin/roles/${roleId}/resources`,
};

// User 관련 API
export const USER_API = {
  // UPDATE: (userId: number) => `/admin/users/${userId}/update`,
  // DELETE: (userId: number) => `/admin/users/${userId}/delete`,
  // GET: (userId: number) => `/admin/users/${userId}`,
  LIST: '/admin/userList',
  ADD_ROLE: (userName: string, roleId: number) =>
    `/admin/users/${userName}/roles/${roleId}`,
  DELETE_ROLE: (userName: string, roleId: number) =>
    `/admin/users/${userName}/roles/${roleId}/delete`,
  ACTIVATE: (userName: string) => `/admin/users/${userName}/activate`,
  DEACTIVATE: (userName: string) => `/admin/users/${userName}/deactivate`,
  RESET_LOGIN_FAILURE: (userName: string) =>
    `/admin/users/${userName}/reset-login-failure`,
};

// Menu Resource 관련 API
export const MENU_RESOURCE_API = {
  LIST: '/admin/resources/menu',
  CREATE: '/admin/resources/menu',
  UPDATE: (resourceId: number) => `/admin/resources/menu/${resourceId}/update`,
  DELETE: (resourceId: number) => `/admin/resources/menu/${resourceId}/delete`,
  GET: (resourceId: number) => `/admin/resources/menu/${resourceId}`,
};

// Attach 관련 API
export const ATTACH_API = {
  GET_FILES: (attachId: number) => `/attach/${attachId}/files`,
  ADD_FILES: (attachId: number) => `/attach/${attachId}/files`,
  DELETE: (fileId: number) => `/attach/${fileId}/delete`,
  UPLOAD: '/attach/upload',
  //첨부파일 논리적삭제
  DELETE_FILE: (fileId: number) => `/attach/files/${fileId}/delete`,
  DOWNLOAD: (fileId: number) => `/attach/download/${fileId}`,
  DOWNLOAD_BUNDLE: (attachId: number) => `/attach/download-bundle/${attachId}`,
  GET_ALL_FILES: '/attach/all-files',
  GET_ALL_ATTACHS: '/attach/all-attaches',

  // UPDATE: (fileId: number) => `/attach/${fileId}/update`,
  // GET: (fileId: number) => `/attach/${fileId}`,
  // LIST: '/attach',
};

// FTP 관련 API (Attach API로 통합)
export const FTP_API = ATTACH_API;

// Email 관련 API
export const EMAIL_API = {
  SEND: '/email/send',
  // UPDATE: (emailId: number) => `/interface/email/${emailId}/update`,
  // DELETE: (emailId: number) => `/interface/email/${emailId}/delete`,
  // GET: (emailId: number) => `/interface/email/${emailId}`,
  // LIST: '/interface/email',
  TEMP_FILE_UPLOAD: '/temp-files/upload',
};

// Menu 관련 API
export const MENU_API = {
  LIST: '/menu',
  BY_ROLES: '/menu/by-roles', // 권한별 메뉴 조회 API (/api 제거)
  // GET: (menuId: number) => `/menu/${menuId}`,
  // CREATE: '/menu/create',
  // UPDATE: (menuId: number) => `/menu/${menuId}/update`,
  // DELETE: (menuId: number) => `/menu/${menuId}/delete`,
};
