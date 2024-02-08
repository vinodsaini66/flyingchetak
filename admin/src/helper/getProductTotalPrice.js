export const getTotalPrice = (basicPrice, adminCommission) => {
  const commission = basicPrice * (adminCommission / 100);

  return +basicPrice + +commission;
};
