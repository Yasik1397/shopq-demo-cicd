import React, { useState } from "react";

import CheckboxSelect from "../../assets/Icons/checkbox_select.svg";
import CheckboxUnselect from "../../assets/Icons/checkbox_unselect.svg";
const CheckBox = ({ onpress, data }) => {
  const [selected, setSelected] = useState(data ? data : false);
  return (
    <>
      {selected ? (
        <CheckboxSelect
          onPress={() => {
            setSelected(!selected), onpress(data);
          }}
        />
      ) : (
        <CheckboxUnselect
          onPress={() => {
            setSelected(!selected), onpress(data);
          }}
        />
      )}
    </>
  );
};
export default React.memo(CheckBox);
