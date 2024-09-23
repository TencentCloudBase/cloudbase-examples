export let shouldFresh = false;
export const orderListShouldFresh = () => (shouldFresh = true);
export const orderListFinishFresh = () => (shouldFresh = false);
