import { assert } from 'midway-mock/bootstrap';
import { JwxtApi } from '../../src/api/jwxt';

describe('test/api/jwxt.test.ts', () => {
  it('should 200', async () => {
    const code = await JwxtApi.getValidateCode();
    assert(code.length > 0);
  });
});
