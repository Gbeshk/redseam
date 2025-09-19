export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
}

export interface SignUpApiResponse {
  message?: string;
  error?: string;
  success?: boolean;
  data?: Record<string, string[] | string | number>;
}

export interface SignUpFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  avatar?: string;
}

export interface SignUpAvatarUploadProps {
  avatar: File | null;
  onAvatarChange: (file: File | null) => void;
  onError: (message: string) => void;
}

export interface SignUpFormInputProps {
  type: string;
  name: keyof SignUpFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  hasIcon?: boolean;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

export interface SignUpMessageDisplayProps {
  message: string;
}

export interface SignUpFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<void>;
  isSubmitting: boolean;
  errors: SignUpFormErrors;
  formData: SignUpFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (file: File | null) => void;
  onTogglePassword: (field: "password" | "confirmPassword") => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  showRequired: boolean;
}
export interface User {
  id?: number;
  username?: string;
  email?: string;
  is_admin?: number;
  avatar?: string;
}
export interface SignUpApiResponsee {
  message: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
    avatar?: string[];
  };
}