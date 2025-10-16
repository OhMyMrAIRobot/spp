export const ErrorMessages = {
  // Validation
  VALIDATION_FAILED: 'Validation failed!',
  INVALID_IDENTIFIER: 'Invalid identifier provided!',

  // Auth
  REGISTRATION_FAILED: 'Registration failed!',
  LOGIN_FAILED: 'Login failed!',
  TOKEN_MISSING: 'Token missing!',
  REFRESH_FAILED: 'Refresh failed!',
  UNAUTHORIZED: 'Unauthorized!',
  FORBIDDEN: 'Forbidden! You don`t have access to this resource!',
  INVALID_CREDENTIALS: 'Invalid credentials!',

  // Project
  FAILED_CREATE_PROJECT: 'Failed to create project!',
  FAILED_UPDATE_PROJECT: 'Failed to update project!',
  FAILED_DELETE_PROJECT: 'Failed to delete project!',
  PROJECT_NOT_FOUND: 'Project not found!',

  // Task
  FAILED_CREATE_TASK: 'Failed to create task!',
  FAILED_UPDATE_TASK: 'Failed to update task!',
  FAILER_DELETE_TASK: 'Failed to delete task!',
  TASK_NOT_FOUND: 'Task not found!',

  // User
  USER_NOT_FOUND: 'User not found!',
  DUPLICATE_USERNAME: 'User with this username already exists: ',
  FAILED_CREATE_USER: 'Failed to create user!',
  FAILED_UPDATE_USER: 'Failed to update user!',
  FAILER_DELETE_USER: 'Failed to delete user!',

  // Attachment
  NO_FILES_UPLOADED: 'No files uploaded!',
  MISSING_FILE: 'File is missing on server!',
  ATTACHMENT_NOT_FOUND: 'Attachment not found!',
  FAILED_UPLOAD_ATTACHMENT: 'Failed to upload attachment!',
  FAILED_DELETE_ATTACHMENT: 'Failed to delete attachment!',
} as const;
