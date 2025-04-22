import { Matches } from 'class-validator';

export const validatePassword = Matches(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
  {
    message:
      'Minimum eight and maximum 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  },
);
