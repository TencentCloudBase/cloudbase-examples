export let shouldFresh = false;
export const addressListShouldFresh = () => (shouldFresh = true);
export const addressListFinishFresh = () => (shouldFresh = false);
