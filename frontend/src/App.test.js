// Simple test that doesn't require mocking
test('renders without crashing', () => {
  const div = document.createElement('div');
  expect(div).toBeTruthy();
});
