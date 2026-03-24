import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInContainer } from '../components/SignIn';

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      const onSubmit = jest.fn();
      render(<SignInContainer onSubmit={onSubmit} />);

      fireEvent.changeText(screen.getByPlaceholderText('Username'), 'testuser');
      fireEvent.changeText(screen.getByPlaceholderText('Password'), 'testpassword');
      fireEvent.press(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith(
          { username: 'testuser', password: 'testpassword' },
          expect.anything()
        );
      });
    });
  });
});
