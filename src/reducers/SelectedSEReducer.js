import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSEProp:
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal")),
  bulkIds: true,
  isIndividualChecked:
    localStorage.getItem("isIndividualCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isIndividualCheckedLocal")),
  isShowInactiveChecked:
    localStorage.getItem("isShowInactiveCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isShowInactiveCheckedLocal")),
  reportRunId: 0,
  directSETreeData:
    localStorage.getItem("") === null
      ? []
      : JSON.parse(localStorage.getItem("")),
  salesExectiveId:
    localStorage.getItem("") === null
      ? []
      : JSON.parse(localStorage.getItem("")),

  expenseButtonState:
    localStorage.getItem("expenseButtonStateLocal") === null
      ? "Open"
      : JSON.parse(localStorage.getItem("expenseButtonStateLocal")),
  vendorId: "",
  vendorNamewithId: "",
  ownerDivisions: "",
  homeScreenMessage: false,
  homeScreenSubmenu: "",
  quaterDate: "",
  actionData: [],
  dateForSe: "",
  neglected: false,
  resourecHrs: [],
  capacityPlanResourceHours: []
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const selectedSEReducer = createSlice({
  name: "selectedSEState",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateExpenseButtonState: (state, action) => {
      state.expenseButtonState = action.payload;
      localStorage.setItem(
        "expenseButtonStateLocal",
        JSON.stringify(state.expenseButtonState)
      );
    },
    updateIsShowInactiveChecked: (state) => {
      state.isShowInactiveChecked = !state.isShowInactiveChecked;
    },
    updateIsIndivChecked: (state) => {
      state.isIndividualChecked = !state.isIndividualChecked;
    },
    setReportRunIdRedux: (state, action) => {
      state.reportRunId = action.payload;
    },
    undoSaveSelectSE: (state, action) => {
      if (action.payload === "save") {
        localStorage.setItem(
          "selectedSELocal",
          JSON.stringify(state.selectedSEProp)
        );
        localStorage.setItem(
          "isIndividualCheckedLocal",
          JSON.stringify(state.isIndividualChecked)
        );
        localStorage.setItem(
          "isShowInactiveCheckedLocal",
          JSON.stringify(state.isShowInactiveChecked)
        );
      } else {
        // Undo - resetting to previous state
        const localStorageData = localStorage.getItem("selectedSELocal");
        const isIndividualCheckedLocal = localStorage.getItem(
          "isIndividualCheckedLocal"
        );
        const isShowInactiveCheckedLocal = localStorage.getItem(
          "isShowInactiveCheckedLocal"
        );
        state.selectedSEProp =
          localStorageData === null ? [] : JSON.parse(localStorageData);
        state.isIndividualChecked =
          isIndividualCheckedLocal === null
            ? false
            : JSON.parse(isIndividualCheckedLocal);

        state.isShowInactiveChecked =
          isShowInactiveCheckedLocal === null
            ? false
            : JSON.parse(isShowInactiveCheckedLocal);
      }
    },
    updateSelectedSEProp: (state, action) => {
      const { item, isChecked } = action.payload;
      console.log(item);
      console.log(isChecked);
      const isEmpPresentThenIndex = state.selectedSEProp.findIndex(
        (obj) => obj.id == item.id
      );
      let isEmpPresentDirSE =
        state.selectedSEProp[isEmpPresentThenIndex]?.hasOwnProperty("key");
      let isEmpToBeAddedDirectSE = item.hasOwnProperty("key");
      let isDirectSEInReduxThenIndex = state.selectedSEProp.findIndex((obj) =>
        obj.hasOwnProperty("key")
      );

      if (isEmpPresentThenIndex != -1) {
        if (
          isEmpPresentDirSE &&
          isEmpToBeAddedDirectSE &&
          isEmpPresentThenIndex != -1
        ) {
          state.selectedSEProp.splice(isEmpPresentThenIndex, 1);
        } else if (
          (isEmpPresentDirSE && isEmpToBeAddedDirectSE) ||
          (isEmpPresentDirSE && !isEmpToBeAddedDirectSE)
        ) {
          state.selectedSEProp.splice(isEmpPresentThenIndex, 1);
          state.selectedSEProp.push(item);
        } else if (!isEmpPresentDirSE && isEmpToBeAddedDirectSE) {
          if (isDirectSEInReduxThenIndex != -1) {
            state.selectedSEProp.splice(isDirectSEInReduxThenIndex, 1);
            state.selectedSEProp.splice(isEmpPresentThenIndex, 1);
            state.selectedSEProp.push(item);
          } else {
            state.selectedSEProp.splice(isEmpPresentThenIndex, 1);
            state.selectedSEProp.push(item);
          }
        } else if (
          !isEmpPresentDirSE &&
          !isEmpToBeAddedDirectSE &&
          !isChecked
        ) {
          state.selectedSEProp.splice(isEmpPresentThenIndex, 1);
        }
      } else {
        if (isEmpToBeAddedDirectSE) {
          if (isDirectSEInReduxThenIndex != -1) {
            state.selectedSEProp.splice(isDirectSEInReduxThenIndex, 1);
            state.selectedSEProp.push(item);
          } else {
            state.selectedSEProp.push(item);
          }
        } else {
          state.selectedSEProp.push(item);
        }
      }

      // if (
      //   (isEmpPresentThenIndex !== -1 && !isChecked) ||
      //   (isEmpPresentThenIndex !== -1 && isChecked && item.key)
      // ) {
      //   state.selectedSEProp.splice(isEmpPresentThenIndex, 1);
      // } else if (isEmpPresentThenIndex !== -1 && isChecked && !item.key) {
      //   //do nothing
      // } else if (isEmpPresentThenIndex !== -1 && isChecked && item.key) {
      //   //do nothing
      // } else {
      //   const isEmpToBeAddedDirectSE = item.key ? true : false;
      //   if (isEmpToBeAddedDirectSE) {
      //     const ifDirectSEPresThenIndex = state.selectedSEProp.findIndex(
      //       (obj) => obj.key
      //     );
      //     if (ifDirectSEPresThenIndex !== -1) {
      //       state.selectedSEProp.splice(ifDirectSEPresThenIndex, 1);
      //       state.selectedSEProp.push(item);
      //     } else {
      //       state.selectedSEProp.push(item);
      //     }
      //   } else {
      //     state.selectedSEProp.push(item);
      //   }
      // }
    },
    emptySelectedSEProp: (state) => {
      state.selectedSEProp = [];
    },
    hideIndirectInactive: (state, action) => {
      const isShowInactive = action.payload;

      if (!isShowInactive)
        state.selectedSEProp = state.selectedSEProp.filter(
          (item) => item.status !== "empInactive"
        );
    },
    updateBulkIdFlag: (state) => {
      state.bulkIds = !state.bulkIds;
    },
    updatedirectSETreeData: (state, action) => {
      state.directSETreeData = action.payload;
    },
    updatedSalesExectiveId: (state, action) => {
      state.salesExectiveId = action.payload;
    },
    updatedVendorId: (state, action) => {
      state.vendorId = action.payload;
    },
    updatedVedorNameWithId: (state, action) => {
      state.vendorNamewithId = action.payload;
    },
    updatedOwnerDivisions: (state, action) => {
      state.ownerDivisions = action.payload;
    },
    updateHomeScreenmsg: (state) => {
      state.homeScreenMessage = !state.homeScreenMessage;
    },
    updateSubmenuName: (state, action) => {
      state.homeScreenSubmenu = action.payload;
    },
    updateQuaterDate: (state, action) => {
      state.quaterDate = action.payload;
    },
    updateActionData: (state, action) => {
      state.actionData = action.payload;
    },
    updateDateForSE: (state, action) => {
      state.dateForSe = action.payload;
    },
    updateNeglected: (state, action) => {
      state.neglected = !state.neglected;
    },
    updateResourceComments: (state, action) => {
      state.resourecHrs = action.payload;
    },
    updateCapacityPlanEditableTableHours: (state, action) => {
      state.capacityPlanResourceHours = action.payload;
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(incrementAsync.pending, (state) => {
  //         state.status = 'loading';
  //       })
  //       .addCase(incrementAsync.fulfilled, (state, action) => {
  //         state.status = 'idle';
  //         state.value += action.payload;
  //       });
  //   },
});

export const {
  updateSelectedSEProp,
  emptySelectedSEProp,
  hideIndirectInactive,
  updateBulkIdFlag,
  undoSaveSelectSE,
  updateIsIndivChecked,
  setReportRunIdRedux,
  updateIsShowInactiveChecked,
  updatedirectSETreeData,
  updatedSalesExectiveId,
  updateExpenseButtonState,
  updatedVendorId,
  updatedVedorNameWithId,
  updatedOwnerDivisions,
  updateHomeScreenmsg,
  updateSubmenuName,
  updateQuaterDate,
  updateActionData,
  updateDateForSE,
  updateNeglected,
  updateResourceComments,
  updateCapacityPlanEditableTableHours,
} = selectedSEReducer.actions;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default selectedSEReducer.reducer;
