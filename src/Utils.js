
// class Utils {
//   static DebugMode = false;
//   static Log = (printObj) => {
//     console.log(printObj);
//     // console.log(this.DebugMode);
//   };
// }
// export default Utils;
class Utils {
  static DebugMode = true;

  static Log = (printObj, key) => {
    if (this.DebugMode) {
      console.log(printObj, key);
    }
  };
}

export default Utils;
