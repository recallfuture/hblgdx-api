import { assert } from 'midway-mock/bootstrap';
import { MyncmcApi } from '../../src/api/myncmc';

describe('test/api/myncmc.test.ts', () => {
  it('should success', async () => {
    const code = await MyncmcApi.login('201643710104', '201643710104');
    console.log(code);
    assert(code === 200);

    const object = await MyncmcApi.getScoreJson();
    console.log(object);
    assert(object);

    const report = MyncmcApi.getScoreReport(object);
    console.log(report);
    assert(report);
  });
});
