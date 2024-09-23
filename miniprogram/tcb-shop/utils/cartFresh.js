export let shouldFresh = false;
export const cartShouldFresh = () => (shouldFresh = true);
export const cartFinishFresh = () => (shouldFresh = false);
