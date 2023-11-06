export const initialPackMacListState = [];

export const PackMacListTypes = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  EMPTY: 'EMPTY',
};

const findMacItem = (macList, itemId) => macList.find((item) => item.itemId === itemId);

export const packMacListReducer = (state, action) => {
  switch (action.type) {
    case PackMacListTypes.ADD:
      console.log('action ADD: ', action);
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
      console.log('action REMOVE: ', action);
      return state.filter((item) => item.itemId !== action.itemId);

    case PackMacListTypes.EMPTY:
      console.log('action EMPTY: ', action);
      return [];

    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};
