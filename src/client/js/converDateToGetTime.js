const converDatetoGetTime = async (data) => {
  let date;
  if (data) {
    date = new Date(data ? data : "");
  } else {
    date = new Date();
  }

  return date.getTime();
};

module.exports = {
  converDatetoGetTime,
};
