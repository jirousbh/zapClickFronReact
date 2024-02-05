export const randomIntFromInterval = function (min: any, max: any) {
  return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
};

export const timeOut = function (ms: any) {
  const promise = new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
  return promise;
};

export const queueLinkId = (linkIdFirst: string, linkIdLast: string) => {
  const queue = [];

  for (var i = Number(linkIdFirst); i <= Number(linkIdLast); i++) {
    queue.push(i);
  }

  return queue;
};

const request = async (formValues: any, ) => {
  const interval = randomIntFromInterval(
    Number(formValues.intervalFirst),
    Number(formValues.intervalLast)
  );

  const queue = queueLinkId(formValues.linkIdFirst, formValues.linkIdLast);

  for (let linkId of queue) {
    await timeOut(interval).then(() => {
      console.log(linkId, "enviado");
    });
  }
};
