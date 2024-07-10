import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Prisma } from '@prisma/client';

// const name = Prisma.PropertyScalarFieldEnum.price;
// こうすると、prismaの所定のリストから'price'が取り出される。つまり name='price'となるだけ
// これを使わずに、const name = 'price';　を追加で書いてもここでは同じこと
const name = 'price';
type FormInputNumberProps = {
  defaultValue?: number;
};

function PriceInput({ defaultValue }: FormInputNumberProps) {
  // 基本的にはGenericに作ったFormInputを使いたいが、priceのフィールドは、minがあったり、
  // defaultValueのtypeがstringではなかったりするから、無理にGenericを修正するより別に作った方が楽
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Price ($)
      </Label>
      <Input
        id={name}
        type="number"
        name={name}
        min={0}
        defaultValue={defaultValue || 100}
        required
      />
    </div>
  );
}
export default PriceInput;
