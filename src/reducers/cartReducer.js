export const initialCartState = [];

export const CartTypes = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  EMPTY: 'EMPTY',
};

const findItem = (cart, itemId, category) => cart.find(
  (item) => item.itemId === itemId && item.category === category,
);

export const cartReducer = (state, action) => {
  // console.log('state: ', state);
  // console.log('state.key: ', state);
  // console.log('action.key: ', action);
  switch (action.type) {
    case CartTypes.ADD:
      if (action.category !== 'pack') {
        const existingItem = findItem(state, action.itemId, action.category);

        if (existingItem) {
          return state.map(
            (item) => (item.itemId === action.itemId && item.category === action.category
              ? {
                ...item,
                quantity: item.quantity + 1,
              }
              : item),
          );
        }

        return [
          ...state,
          {
            itemId: action.itemId,
            category: action.category,
            isExchangedOrReturned: false,
            quantity: 1,
            key: action.itemId,
          },
        ];
      }
      // For items in 'pack' category, add a new entry for each addition
      return [
        ...state,
        {
          itemId: action.itemId,
          category: action.category,
          isExchangedOrReturned: false,
          quantity: 1,
          key: Date.now(),
          subItem: action.macList,
          giftOption: action.giftOptionInfo,
        },
      ];

    case CartTypes.REMOVE:
      return state.filter(
        (item) => item.key !== action.key,
      );

      // return state.filter((item) => item.itemId !== action.itemId);

      // return state.filter(
      //   (item) => !(item.itemId === action.itemId && item.category === action.category),
      // );

      // {
      //   const indexToRemove = state.findIndex(
      //     (item) => item.itemId === action.itemId && item.category === action.category,
      //   );

      //   if (indexToRemove !== -1) {
      //     // Create a new array without the item to be removed
      //     const newState = [
      //       ...state.slice(0, indexToRemove),
      //       ...state.slice(indexToRemove + 1),
      //     ];

      //     return newState;
      //   }

      //   // If no item found, return the current state
      //   return state;
      // }

    case CartTypes.EMPTY:
      return [];

    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};
