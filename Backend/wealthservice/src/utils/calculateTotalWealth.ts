export const calculateTotalWealth =
(
  equity: number,
  mutualFunds: number,
  realEstate: number
) => {

  return (
    equity +
    mutualFunds +
    realEstate
  );
};