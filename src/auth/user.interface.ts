interface Photo {
  value: string;
}

export interface FortyTwoUser {
  id: number;
  nickname: string;
  photos: Photo[];
}
