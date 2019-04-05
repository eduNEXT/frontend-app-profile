/* eslint-disable global-require */
import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureMockStore from 'redux-mock-store';

import * as analytics from '../analytics/analytics';
import ConnectedProfilePage from './ProfilePage';


const mockStore = configureMockStore();
const storeMocks = {
  loadingApp: require('./__mocks__/loadingApp.mockStore.js'),
  viewOwnProfile: require('./__mocks__/viewOwnProfile.mockStore.js'),
  viewOtherProfile: require('./__mocks__/viewOtherProfile.mockStore.js'),
  savingEditedBio: require('./__mocks__/savingEditedBio.mockStore.js'),
};
const requiredProfilePageProps = {
  isCurrentUserProfile: true,
  fetchProfile: () => {},
  saveProfile: () => {},
  saveProfilePhoto: () => {},
  deleteProfilePhoto: () => {},
  openField: () => {},
  closeField: () => {},
  match: { params: { username: 'staff' } },
};


describe('<ProfilePage />', () => {
  describe('Renders correctly in various states', () => {
    it('app loading', () => {
      analytics.logEvent = jest.fn();
      const tree = renderer
        .create((
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.loadingApp)}>
              <ConnectedProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        ))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('viewing own profile', () => {
      analytics.logEvent = jest.fn();
      const tree = renderer
        .create((
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.viewOwnProfile)}>
              <ConnectedProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        ))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('viewing other profile', () => {
      analytics.logEvent = jest.fn();
      const tree = renderer
        .create((
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.viewOtherProfile)}>
              <ConnectedProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        ))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('while saving an edited bio', () => {
      analytics.logEvent = jest.fn();
      const tree = renderer
        .create((
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.savingEditedBio)}>
              <ConnectedProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        ))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });


  describe('handles analytics', () => {
    it('calls logEvent when mounting', () => {
      analytics.logEvent = jest.fn();
      mount((
        <IntlProvider locale="en">
          <Provider store={mockStore(storeMocks.loadingApp)}>
            <ConnectedProfilePage
              {...requiredProfilePageProps}
              match={{ params: { username: 'test-username' } }}
            />
          </Provider>
        </IntlProvider>
      ));

      expect(analytics.logEvent.mock.calls.length).toBe(1);
      expect(analytics.logEvent.mock.calls[0][0]).toEqual('edx.profile.viewed');
      expect(analytics.logEvent.mock.calls[0][1]).toEqual({
        username: 'test-username',
      });
    });
  });
});