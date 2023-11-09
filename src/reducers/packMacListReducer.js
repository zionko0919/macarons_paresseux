/* eslint-disable no-case-declarations */
export const initialPackMacListState = [];

export const PackMacListTypes = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  EMPTY: 'EMPTY',
};

const findMacItem = (macList, itemId) => macList.find(
  (item) => item.itemId === itemId,
);

export const packMacListReducer = (state, action) => {
  // console.log('state', state);
  // console.log('action', action);
  switch (action.type) {
    case PackMacListTypes.ADD:
      if (findMacItem(state, action.itemId)) {
        return state.map((item) => (item.itemId === action.itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item));
      }
      return [
        ...state,
        { itemId: action.itemId, quantity: 1 },
      ];

    case PackMacListTypes.REMOVE:
      return state.filter((item) => item.itemId !== action.itemId);

    case PackMacListTypes.EMPTY:
      return [];

    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};
