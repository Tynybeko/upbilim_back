export interface ChangePasswordInterface {
  isChanged: boolean;
  message: string;
  status: number;
  oldPassword?: string[] | undefined;
}
