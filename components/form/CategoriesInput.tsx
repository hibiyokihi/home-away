import { Label } from '@/components/ui/label';
import { categories } from '@/utils/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const name = 'category';
function CategoriesInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Categories
      </Label>
      <Select
        defaultValue={defaultValue || categories[0].label}
        name={name}
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
          {/* SelectTriggerの中に入れた要素をクリックすると、選択肢のリストが開く
          SelectValueは選択されているSelectItem(iconとlabelのセット)を表示するから、それをtriggerとする。 */}
        </SelectTrigger>
        <SelectContent>
          {categories.map((item) => {
            return (
              <SelectItem key={item.label} value={item.label}>
                <span className="flex items-center gap-2">
                  <item.icon /> {item.label}
                  {/* iconをIconTypeでタイプ定義してるから、このように使える */}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
export default CategoriesInput;