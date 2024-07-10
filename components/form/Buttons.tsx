'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { SignInButton } from '@clerk/nextjs';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

type btnSize = 'default' | 'lg' | 'sm'

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
  // Buttonのpropsはshadcnの方でのデフォルトタイプがあり、単に size?:string; とするとエラーになる。
  // sizeのタイプ選択肢を規定して、それを参照する形にする
};

export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg'
  // 上記の通りデフォルト値を設定してるから、SubmitButtonを使う時に何も指定しなくてもエラーは生じない
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  // このコンポーネント(SubmitButton)をform内に置くと、そのformのsubmit時のstatusを捉えることができる
  return (
    <Button
      type="submit"
      size={size}
      disabled={pending}
      className={`capitalize ${className}`}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}
export default SubmitButton;

export const CardSignInButton = () => {
  return (
    <SignInButton mode="modal">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="p-2 cursor-pointer"
        asChild
      >
        <FaRegHeart />
      </Button>
    </SignInButton>
  );
};

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();
  // このコンポーネント(CardSubmitButton)をform内に置くと、そのformのsubmit時のstatusを捉えることができる
  return (
    <Button
      type="submit"
      size="icon"
      variant="outline"
      className=" p-2 cursor-pointer"
    >
      {pending ? (
        <ReloadIcon className="animate-spin" />
      ) : isFavorite ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};