export {};


declare global {
  type Maybe<T> = T | null | undefined

  type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
  };
}
