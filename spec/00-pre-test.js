const { backupOriginalData } = require('./testUtils');

describe('00. Pre test', () => {
  it('start', async () => {
    const backupData = await backupOriginalData();
    console.log(Object.keys(backupData));
  });
});
