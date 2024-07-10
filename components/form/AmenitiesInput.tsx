'use client';
import { useState } from 'react';
import { amenities, Amenity } from '@/utils/amenities';
import { Checkbox } from '@/components/ui/checkbox';

function AmenitiesInput({ defaultValue }: { defaultValue?: Amenity[] }) {
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(
    defaultValue || amenities
  );

  const handleChange = (amenity: Amenity) => {
    // 1つのamenityを受け取って、amenityのリストをmapして一致するものを探して、selectedプロパティをtoggleする
    setSelectedAmenities((prev) => {
      return prev.map((a) => {
        if (a.name === amenity.name) {
          return { ...a, selected: !a.selected };
        }
        return a;
      });
    });
  };

  return (
    <section>
      <input
        type="hidden"
        name="amenities"
        value={JSON.stringify(selectedAmenities)}
        // formからデータを送る際はArrayのままでは送れないから、stringに変換する
      />
      <div className="grid grid-cols-2 gap-4">
        {selectedAmenities.map((amenity) => (
          <div key={amenity.name} className="flex items-center space-x-2">
            <Checkbox
              id={amenity.name}
              // labelのhtmlForと連動してる。チェックボックスの右にlabelが並ぶからこの順序
              checked={amenity.selected}
              // handleChangeが実行されると、このアイテムのselectedがトグルされ、checkedがトグルされることでUIに反映される
              onCheckedChange={() => handleChange(amenity)}
            />
            <label
              htmlFor={amenity.name}
              className="text-sm font-medium leading-none capitalize flex gap-x-2 items-center"
            >
              {amenity.name}
              <amenity.icon className="w-4 h-4" />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
export default AmenitiesInput;
