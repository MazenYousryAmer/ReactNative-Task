import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import Details from '../Screens/Details';

jest.mock('../Components/LoadingView', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return () => <Text testID="loading-view">Loading...</Text>;
});

jest.mock('../Components/ErrorView', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return () => <Text testID="error-view">Something went wrong</Text>;
});

const mockRoute = {
  params: {
    user: {
      id: 12345,
      login: 'john',
    },
  },
};

const mockUserDetails = {
  login: 'john',
  id: 12345,
  name: 'John Doe',
  bio: 'React Native Developer',
  followers: 100,
  following: 50,
};

describe('Details Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = jest.fn();
  });

  it('displays loading view while fetching user details', async () => {
    let resolveFetch: any;

    (globalThis.fetch as jest.Mock).mockReturnValueOnce(
      new Promise(resolve => {
        resolveFetch = resolve;
      }),
    );

    const { getByTestId } = await render(<Details route={mockRoute} />);

    expect(getByTestId('loading-view')).toBeTruthy();

    await act(async () => {
      resolveFetch({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserDetails),
      });
    });
  });

  it('fetches user details from GitHub API', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserDetails),
    });

    await render(<Details route={mockRoute} />);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/john',
      );
    });
  });

  it('displays the GitHub username after fetching details', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserDetails),
    });

    const { getByText } = await render(<Details route={mockRoute} />);

    await waitFor(() => {
      expect(getByText('john')).toBeTruthy();
    });
  });

  it('displays the user bio when available', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserDetails),
    });

    const { getByText } = await render(<Details route={mockRoute} />);

    await waitFor(() => {
      expect(getByText('React Native Developer')).toBeTruthy();
    });
  });

  it('displays No bio available when user has no bio', async () => {
    const userWithoutBio = {
      ...mockUserDetails,
      bio: null,
    };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(userWithoutBio),
    });

    const { getByText } = await render(<Details route={mockRoute} />);

    await waitFor(() => {
      expect(getByText('No bio available')).toBeTruthy();
    });
  });

  it('displays error view when API response is unsuccessful', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: 'Not Found',
      }),
    });

    const { getByTestId } = await render(<Details route={mockRoute} />);

    await waitFor(() => {
      expect(getByTestId('error-view')).toBeTruthy();
    });
  });

  it('displays error view when network request fails', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const { getByTestId } = await render(<Details route={mockRoute} />);

    await waitFor(() => {
      expect(getByTestId('error-view')).toBeTruthy();
    });
  });

  it('uses the username passed through route params', async () => {
    const customRoute = {
      params: {
        user: {
          id: 999,
          login: 'testuser',
        },
      },
    };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        ...mockUserDetails,
        login: 'testuser',
      }),
    });

    await render(<Details route={customRoute} />);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
      );
    });
  });

  it('hides loading view after successful API request', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserDetails),
    });

    const { queryByTestId, getByText } = await render(
      <Details route={mockRoute} />,
    );

    await waitFor(() => {
      expect(getByText('john')).toBeTruthy();
    });

    expect(queryByTestId('loading-view')).toBeNull();
  });

  it('does not display user details when API request fails', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const { getByTestId, queryByText } = await render(
      <Details route={mockRoute} />,
    );

    await waitFor(() => {
      expect(getByTestId('error-view')).toBeTruthy();
    });

    expect(queryByText('john')).toBeNull();
  });
});
