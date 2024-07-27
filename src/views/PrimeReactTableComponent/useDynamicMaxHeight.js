import { useState, useEffect } from 'react';

const useDynamicMaxHeight = (offset) => {
  const [maxHeight, setMaxHeight] = useState(); // Default maxHeight
  const [isSetMaxHeight, setIsSetMaxHeight] = useState(true)

  useEffect(() => {
    if (offset) {

      // console.log(offset, "offset");
      const offsetTop = offset[0].offsetTop;
      
      const newMaxHeight = Math.max(100, window.innerHeight - offsetTop);
      console.log(window.innerHeight,offsetTop, newMaxHeight,"offset window.innerHeight");
      // console.log('venkat row', newMaxHeight);
      setIsSetMaxHeight(false);
      setMaxHeight(newMaxHeight<450?450:newMaxHeight);
      if(isSetMaxHeight){
        setTimeout(()=>{
          setMaxHeight()
        },1000)
        // setIsSetMaxHeight(true)
      }
    } else {
      console.log('venkat row else block');
    }
  }, [maxHeight, offset]);
  

  return maxHeight;
};

export default useDynamicMaxHeight;
