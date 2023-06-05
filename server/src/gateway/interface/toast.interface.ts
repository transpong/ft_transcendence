export interface ToastInterface {
  info: string;
  message: string;
  is_invite: boolean;
  is_invite_accepted?: boolean;
  data?: {
    [key: string]: string;
  };
}
