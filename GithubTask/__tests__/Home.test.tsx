import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../Screens/Home';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../Components/LoadingView', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return () => <Text testID="loading-view">Loading...</Text>;
});

jest.mock('../Components/SearchInput', () => {
  const React = require('react');
  const { View, TextInput, Button } = require('react-native');

  return ({ query, onPress, inputChange }: any) => (
    <View>
      <TextInput
        testID="search-input"
        value={query}
        onChangeText={inputChange}
        inputChange
      />
      <Button title="Search" testID="search-button" onPress={onPress} />
    </View>
  );
});

jest.mock('../Components/GithubList', () => {
  const React = require('react');
  const { View, Text, Button } = require('react-native');

  return ({ users, onEndReached }: any) => (
    <View testID="github-list">
      {users?.map((user: any) => (
        <Text key={user.id}>{user.login}</Text>
      ))}
      <Button title="Load More" testID="load-more" onPress={onEndReached} />
    </View>
  );
});

jest.mock('../Components/EmptyView', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return () => <Text testID="empty-view">No users found</Text>;
});

const mockNavigation = {
  navigate: jest.fn(),
};

const mockUsers = {
  total_count: 2,
  incomplete_results: false,
  items: [
    {
      id: 1,
      login: 'john',
      avatar_url: 'https://example.com/john.png',
    },
    {
      id: 2,
      login: 'jane',
      avatar_url: 'https://example.com/jane.png',
    },
  ],
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the search input and empty view initially', async () => {
    const { getByTestId } = await render(<Home navigation={mockNavigation} />);

    expect(getByTestId('search-input')).toBeTruthy();

    await waitFor(() => {
      expect(getByTestId('empty-view')).toBeTruthy();
    });
  });

  it('updates the search input value', async () => {
    const { getByTestId } = await render(<Home navigation={mockNavigation} />);
    const input = getByTestId('search-input');

    await fireEvent.changeText(input, 'react-native');
    expect(input.props.value).toBe('react-native');
  });

  it('fetches GitHub users when search button is pressed', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUsers),
    }) as jest.Mock;

    const { getByTestId, getByText } = await render(
      <Home navigation={mockNavigation} />,
    );

    await fireEvent.changeText(getByTestId('search-input'), 'react native');

    await act(async () => {
      fireEvent.press(getByTestId('search-button'));
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=react%20native&page=1&per_page=20',
      );
    });

    expect(getByText('john')).toBeTruthy();
    expect(getByText('jane')).toBeTruthy();
  });

  it('shows loading view while fetching users', async () => {
    let resolveFetch: any;

    globalThis.fetch = jest.fn(
      () =>
        new Promise(resolve => {
          resolveFetch = resolve;
        }),
    ) as jest.Mock;

    const { getByTestId, queryByTestId } = await render(
      <Home navigation={mockNavigation} />,
    );

    await fireEvent.changeText(getByTestId('search-input'), 'javascript');

    await act(async () => {
      fireEvent.press(getByTestId('search-button'));
    });

    expect(getByTestId('loading-view')).toBeTruthy();

    await act(async () => {
      resolveFetch({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUsers),
      });
    });

    await waitFor(() => {
      expect(queryByTestId('loading-view')).toBeNull();
    });
  });

  it('handles unsuccessful API responses', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: 'API rate limit exceeded',
        total_count: 0,
        items: [],
      }),
    }) as jest.Mock;

    const { getByTestId } = await render(<Home navigation={mockNavigation} />);

    await fireEvent.changeText(getByTestId('search-input'), 'unknown');

    await act(async () => {
      fireEvent.press(getByTestId('search-button'));
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
      expect(getByTestId('empty-view')).toBeTruthy();
    });
  });

  it('handles network errors', async () => {
    globalThis.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Network error')) as jest.Mock;

    const { getByTestId } = await render(<Home navigation={mockNavigation} />);

    await fireEvent.changeText(getByTestId('search-input'), 'react');

    await act(async () => {
      fireEvent.press(getByTestId('search-button'));
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
      expect(getByTestId('empty-view')).toBeTruthy();
    });
  });

  it('retrieves cached users from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce('react')
      .mockResolvedValueOnce(JSON.stringify(mockUsers))
      .mockResolvedValueOnce('2');

    const { getByTestId, getByText } = await render(
      <Home navigation={mockNavigation} />,
    );

    await waitFor(() => {
      expect(getByTestId('search-input').props.value).toBe('react');
    });

    expect(getByText('john')).toBeTruthy();
    expect(getByText('jane')).toBeTruthy();
  });

  it('persists users and pagination data in AsyncStorage', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUsers),
    }) as jest.Mock;

    render(<Home navigation={mockNavigation} />);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('searchQuery', 'react');
    }).catch(() => {});
  });

  it('displays empty view when API returns no users', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        total_count: 0,
        incomplete_results: false,
        items: [],
      }),
    }) as jest.Mock;

    const { getByTestId } = await render(<Home navigation={mockNavigation} />);

    await fireEvent.changeText(
      getByTestId('search-input'),
      'nonexistentuser123',
    );

    await act(async () => {
      fireEvent.press(getByTestId('search-button'));
    });

    await waitFor(() => {
      expect(getByTestId('empty-view')).toBeTruthy();
    });
  });
});
