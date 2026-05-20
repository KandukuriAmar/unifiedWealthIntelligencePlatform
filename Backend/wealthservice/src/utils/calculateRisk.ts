export const calculateRisk =
(
  equityPercentage: number
) => {

  if (equityPercentage > 70) {
    return "High";
  }

  if (equityPercentage > 40) {
    return "Moderate";
  }

  return "Low";
};