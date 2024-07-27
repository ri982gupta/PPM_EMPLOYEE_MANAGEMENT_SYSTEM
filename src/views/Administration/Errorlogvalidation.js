const ErrorLogGlobalValidation = (props) => {
    let data = props.current;
  
    let finalRes = [];
  
    const addingClass = (ele, value) => {
      if (value == "") {
        ele.classList.add("abc");
        finalRes.push(true);
      } else {
        ele.classList.remove("error-block");
        finalRes.push(false);
      }
    };
  
    for (let i = 0; i < data.length; i++) {
      let parentClassList = data[i].classList;
  
      let ele = null;
  
      if (parentClassList.contains("text")) {
        ele = data[i];
        addingClass(ele, ele.value);
        //   return;
      } else if (parentClassList.contains("datepicker")) {
        let addingBorder = data[i].children[0].children[0];
        let value = addingBorder.children[0].value;
        //   ele = data[i];
        addingClass(addingBorder, value);
        //   return;
      } else if (parentClassList.contains("multiselect")) {
        let addingBorder = data[i].children[0].children[0].children[0];
        let classListValue = addingBorder.children[0].children[0].classList;
        let value = classListValue.contains("gray") ? "" : "present";
        addingClass(addingBorder, value);
      } else if (parentClassList.contains("textfield")) {
        let addingBorder = data[i].children[0];
        addingClass(addingBorder, addingBorder.value);
      } else if (parentClassList.contains("autocomplete")) {
        let addingBorder = data[i].children[0].children[0].children[0];
        let value = addingBorder.children[0].children[0].value;
        addingClass(addingBorder, value);
      } else if (parentClassList.contains("reactautocomplete")) {
        let addingBorder =
          data[i].children[0].children[0].children[0].children[0];
        console.log(addingBorder);
        let value = addingBorder.children[0].children[0].value;
  
        console.log(value);
  
        addingClass(addingBorder, value);
      }
  
      // let value = ele.value;
  
      // if (ele.type == undefined) {
      //   value = ele.input.value;
      //   console.log(value);
      // }
      // console.log(ele.classList);
    }
  
    return finalRes.includes(true);
  };
  
  export default ErrorLogGlobalValidation;
  