export interface SignUpInput {
  username: string;
  name: string;
  password: string;
  gender: 'male' | 'female' | 'diverse';
}

export interface LoginInput {
  username: string;
  password: string;
}