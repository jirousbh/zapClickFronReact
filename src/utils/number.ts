const pad = (num: number | string, size: number = 4) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

export { pad };
