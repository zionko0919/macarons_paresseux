export const initialPackMacListState = [];

export const PackMacListTypes = {
  ADD: 'ADD',
};

const findMacItem = (macList, itemId) => macList.find((item) => item.itemId === itemId);

export const packMacListReducer = (state, action) => {
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

    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};
