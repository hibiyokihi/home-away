import { Input } from '../ui/input';
import { Label } from '../ui/label';

function ImageInput() {
  const name = 'image';
  // スペルエラーを防止する意味から、変数に入れているだけ。
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalizer">
        Image
      </Label>
      <Input
        id={name}
        name={name}
        type="file"
        required
        accept="image/*"
        className="max-w-xs"
      />
    </div>
  );
}
export default ImageInput;
