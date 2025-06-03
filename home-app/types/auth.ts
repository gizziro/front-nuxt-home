
export interface LoginRequest {
  userId: string
  password: string
}

export interface UserToken {
  accessToken: string;  
  refreshToken: string;
}



export interface LoginUser {
  email: string;
  status: string;
  type: string;
  username: string;
  token: UserToken;
}
