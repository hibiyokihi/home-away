export type actionFunction = (prevState:any, formData:FormData) => Promise<{ message: string }>;
// 実際のFnではなく、Fnのタイプを規定してるだけ。
// asyncFnで、prevStateとformDataを受け取って、resolveするとmessageを返す

export type PropertyCardProps = {
  image: string;
  id: string;
  name: string;
  tagline: string;
  country: string;
  price: number;
};