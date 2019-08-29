import { assert } from 'midway-mock/bootstrap';
import { JxxtApi } from '../../src/api/jxxt';
import { Resource } from '../../src/model/resource';

describe('test/api/jxxt.test.ts', () => {
  it('should success', async () => {
    const code = await JxxtApi.login('201643710104', 'hblgdx123');
    console.log(code);
    assert(code === 200);

    const list = await JxxtApi.getHomeworkList('32340');
    console.log(list);
    assert(list.length > 0);

    const detail = await JxxtApi.getHomeworkDetail(list[0].id);
    console.log(detail);
    assert(detail);

    const resources: Resource[] = await JxxtApi.getResourceList('32340');
    console.log(resources);
    assert(resources.length > 0);
  });
});
