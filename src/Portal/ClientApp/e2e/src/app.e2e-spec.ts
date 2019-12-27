import { AppPage } from './app.po';

describe('Portal', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display application title: Portal', () => {
    page.navigateTo();
    expect(page.getAppTitle()).toEqual('Portal');
  });
});
