exports.main = async function(event) {
  const { str = 'tcb' } = event;

  return {
    data: Buffer.from(str).toString('base64')
  };
};
