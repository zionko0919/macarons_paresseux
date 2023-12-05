// Just testing out what cart item structure should be.
// 3 items in the cart.
// 1 drink
// 1 4 pack box without gift wrap option
// 1 4 pack box with gift wrap option
// eslint-disable-next-line no-unused-vars
const cart = [
  {
    itemId: 'coffee',
    category: 'drink',
    quantity: 1,
    key: 'coffee',
  },
  {
    itemId: 'fourpack',
    category: 'pack',
    quantity: 1,
    key: 'fp1',
    giftOption: false,
    subtitem: [{ itemId: 'lemon', quantity: 2 }, { itemId: 'Almond', quantity: 2 }],
  },
  {
    itemId: 'fourpack',
    category: 'pack',
    quantity: 1,
    key: 'fp2',
    giftOption: true,
    giftMessage: 'Happy Birthday',
    giftSender: 'Sean',
    subtitem: [{ itemId: 'lemon', quantity: 2 }, { itemId: 'Almond', quantity: 2 }],
  }];
